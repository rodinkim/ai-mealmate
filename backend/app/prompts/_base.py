from langchain_core.prompts import ChatPromptTemplate

JSON_SCHEMA = """
{{
  "goal": "목표",
  "days": 일수,
  "plan": [
    {{
      "day": 1,
      "breakfast": {{
        "name": "음식명",
        "ingredients": [{{"name": "재료명", "amount": "양"}}],
        "calories": 칼로리(숫자),
        "description": "한줄 설명"
      }},
      "lunch": {{
        "name": "음식명",
        "ingredients": [{{"name": "재료명", "amount": "양"}}],
        "calories": 칼로리(숫자),
        "description": "한줄 설명"
      }},
      "dinner": {{
        "name": "음식명",
        "ingredients": [{{"name": "재료명", "amount": "양"}}],
        "calories": 칼로리(숫자),
        "description": "한줄 설명"
      }},
      "total_calories": 하루합계(숫자)
    }}
  ]
}}"""

HUMAN_TEMPLATE = """목표: {goal}
기간: {days}일
하루 목표 칼로리: {calories}kcal
알레르기/제외 식품: {allergies}

위 조건에 맞는 {days}일치 식단을 생성해주세요."""


def make_prompt(system_instruction: str) -> ChatPromptTemplate:
    system = f"{system_instruction}\n\n다른 설명 없이 JSON만 출력하세요.\n{JSON_SCHEMA}"
    return ChatPromptTemplate.from_messages([
        ("system", system),
        ("human", HUMAN_TEMPLATE),
    ])
