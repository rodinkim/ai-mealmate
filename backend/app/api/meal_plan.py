from fastapi import APIRouter, HTTPException
from app.models.schemas import DietRequest
from app.services.meal_planner import generate_meal_plan as meal_plan_service

router = APIRouter(prefix="/api/meal-plan", tags=["meal-plan"])


@router.post("/generate")
async def generate_meal_plan(request: DietRequest):
    try:
        plan = await meal_plan_service(request)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
