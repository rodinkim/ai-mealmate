from langchain_core.output_parsers import JsonOutputParser

from app.core.llm import llm
from app.models.schemas import DietGoal, DietRequest
from app.prompts import DIET_PROMPT, BULK_PROMPT, DIABETES_PROMPT, VEGAN_PROMPT

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


async def generate_meal_plan(request: DietRequest) -> dict:
    chain = PROMPT_MAP[request.goal] | llm | JsonOutputParser()

    return await chain.ainvoke({
        "goal": request.goal.value,
        "days": request.days,
        "calories": request.calories_per_day or DEFAULT_CALORIES[request.goal],
        "allergies": ", ".join(request.allergies) if request.allergies else "없음",
    })
