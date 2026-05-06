import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.meal_plan import router as meal_plan_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="밀메이트 API",
    description="목표에 맞는 맞춤 식단을 생성합니다.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:80",
        "http://localhost:8081",
        "https://mealsmates.com",
        "https://www.mealsmates.com",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    logger.info(f"→ {request.method} {request.url.path}")
    response = await call_next(request)
    elapsed = (time.time() - start) * 1000
    logger.info(f"← {response.status_code} {request.url.path} ({elapsed:.0f}ms)")
    return response


app.include_router(meal_plan_router)


@app.get("/")
def root():
    return {"message": "밀메이트 API v0.1.0"}
