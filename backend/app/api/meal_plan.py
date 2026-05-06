import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import DietRequest
from app.services.meal_planner import generate_meal_plan as meal_plan_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/meal-plan", tags=["meal-plan"])


@router.post("/generate")
async def generate_meal_plan(request: DietRequest):
    logger.info(
        f"식단 요청 | goal={request.goal.value} days={request.days} "
        f"calories={request.calories_per_day} allergies={request.allergies}"
    )
    try:
        plan = await meal_plan_service(request)
        logger.info(f"식단 응답 완료 | goal={request.goal.value} plan_days={len(plan.get('plan', []))}")
        return plan
    except Exception as e:
        logger.error(f"식단 생성 실패 | goal={request.goal.value} error={e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
