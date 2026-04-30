from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.meal_plan import router as meal_plan_router

app = FastAPI(
    title="AI 식단 생성 서비스",
    description="AI가 목표에 맞는 식단을 생성하고 쿠팡 구매 링크를 제공합니다.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "https://mealsmates.com",
        "https://www.mealsmates.com",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meal_plan_router)


@app.get("/")
def root():
    return {"message": "AI 식단 생성 서비스 v0.1.0"}
