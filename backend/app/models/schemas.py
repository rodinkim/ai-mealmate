from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class DietGoal(str, Enum):
    diet = "다이어트"
    bulk = "벌크업"
    diabetes = "당뇨관리"
    vegan = "비건"


class DietRequest(BaseModel):
    goal: DietGoal
    days: int = 3
    calories_per_day: Optional[int] = None
    allergies: Optional[List[str]] = []


class Ingredient(BaseModel):
    name: str
    amount: str


class MealItem(BaseModel):
    name: str
    ingredients: List[Ingredient]
    calories: int
    description: str


class DailyMeal(BaseModel):
    day: int
    breakfast: MealItem
    lunch: MealItem
    dinner: MealItem
    total_calories: int


class DietPlanResponse(BaseModel):
    goal: str
    days: int
    plan: List[DailyMeal]
