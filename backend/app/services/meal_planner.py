import logging

from langchain_core.output_parsers import JsonOutputParser

from app.core.llm import llm
from app.models.schemas import DietGoal, DietRequest
from app.prompts import BULK_PROMPT, DIABETES_PROMPT, DIET_PROMPT, VEGAN_PROMPT

logger = logging.getLogger(__name__)

PROMPT_MAP = {
    DietGoal.diet:     DIET_PROMPT,
    DietGoal.bulk:     BULK_PROMPT,
    DietGoal.diabetes: DIABETES_PROMPT,
    DietGoal.vegan:    VEGAN_PROMPT,
}

DEFAULT_CALORIES = {
    DietGoal.diet:     1500,
    DietGoal.bulk:     3000,
    DietGoal.diabetes: 1800,
    DietGoal.vegan:    2000,
}


def _meal_calories(meal: dict | None) -> int:
    if not meal or not isinstance(meal, dict):
        return 0
    c = meal.get("calories")
    try:
        return int(c) if c is not None else 0
    except (TypeError, ValueError):
        return 0


def _normalize_ingredient(ing: dict | None) -> dict:
    if not isinstance(ing, dict):
        return {"name": "", "amount": ""}
    return {
        "name": str(ing.get("name") or ""),
        "amount": str(ing.get("amount") or ""),
    }


def _normalize_ingredients(raw) -> list:
    if not isinstance(raw, list):
        return []
    return [_normalize_ingredient(x) for x in raw]


def _normalize_meal_slot(raw: dict | None) -> dict:
    if not isinstance(raw, dict):
        raw = {}
    return {
        "name": str(raw.get("name") or "-"),
        "ingredients": _normalize_ingredients(raw.get("ingredients")),
        "calories": _meal_calories(raw),
        "description": str(raw.get("description") or ""),
    }


def _normalize_plan_days(data: dict) -> dict:
    plan = data.get("plan")
    if not isinstance(plan, list):
        data["plan"] = []
        return data
    for day in plan:
        if not isinstance(day, dict):
            continue
        for key in ("breakfast", "lunch", "dinner"):
            day[key] = _normalize_meal_slot(day.get(key))
    return data


def _log_llm_token_usage(message) -> None:
    um = getattr(message, "usage_metadata", None)
    if isinstance(um, dict) and um:
        inp = um.get("input_tokens")
        out = um.get("output_tokens")
        tot = um.get("total_tokens")
        if inp is not None or out is not None or tot is not None:
            logger.info(
                "LLM token usage | input_tokens=%s output_tokens=%s total_tokens=%s",
                inp,
                out,
                tot,
            )
        else:
            logger.info("LLM token usage | usage_metadata=%s", um)
        return

    rm = getattr(message, "response_metadata", None)
    if isinstance(rm, dict):
        usage = rm.get("usage")
        if usage:
            logger.info("LLM token usage | %s", usage)
            return

    ak = getattr(message, "additional_kwargs", None)
    if isinstance(ak, dict):
        usage = ak.get("usage")
        if usage:
            logger.info("LLM token usage | %s", usage)
            return

    logger.debug("LLM token usage | not available on model response")


def _ensure_daily_totals(data: dict) -> dict:
    for day in data.get("plan") or []:
        if not isinstance(day, dict):
            continue
        if day.get("total_calories") is None:
            day["total_calories"] = (
                _meal_calories(day.get("breakfast"))
                + _meal_calories(day.get("lunch"))
                + _meal_calories(day.get("dinner"))
            )
    return data


async def generate_meal_plan(request: DietRequest) -> dict:
    calories = request.calories_per_day or DEFAULT_CALORIES[request.goal]
    allergies = ", ".join(request.allergies) if request.allergies else "없음"

    logger.info(f"LLM 호출 시작 | model={llm.model} goal={request.goal.value} days={request.days} calories={calories}")

    prompt = PROMPT_MAP[request.goal]

    # Claude 원본 응답 확인용 — JSON 파싱 전 raw 텍스트 로깅
    raw_chain = prompt | llm
    raw_response = await raw_chain.ainvoke({
        "goal": request.goal.value,
        "days": request.days,
        "calories": calories,
        "allergies": allergies,
    })
    raw_text = raw_response.content if hasattr(raw_response, "content") else str(raw_response)
    _log_llm_token_usage(raw_response)
    logger.debug(f"Claude 원본 응답:\n{raw_text}")

    # JSON 파싱
    try:
        parser = JsonOutputParser()
        result = parser.parse(raw_text)
        _normalize_plan_days(result)
        _ensure_daily_totals(result)
        logger.info(f"LLM 호출 완료 | goal={request.goal.value} plan_days={len(result.get('plan', []))}")
        return result
    except Exception as parse_err:
        logger.error(f"JSON 파싱 실패 | error={parse_err}\nraw_text={raw_text[:500]}")
        raise ValueError(f"식단 데이터 파싱 오류: {parse_err}")
