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
    system = (
        f"{system_instruction}\n\n"
        "## 출력 규칙 (반드시 준수)\n"
        "- JSON 외에 어떤 텍스트도 출력하지 마세요\n"
        "- 마크다운 코드 블록(```json) 사용 금지\n"
        "- 추가 설명, 제안사항, 주석 출력 금지\n"
        "- 응답의 첫 글자는 반드시 {{ 이어야 합니다\n\n"
        f"출력 형식:\n{JSON_SCHEMA}"
    )
    return ChatPromptTemplate.from_messages([
        ("system", system),
        ("human", HUMAN_TEMPLATE),
    ])
