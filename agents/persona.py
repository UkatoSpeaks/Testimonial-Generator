from langchain_core.messages import HumanMessage
from config.llm import llm
from graph.state import TestimonialState
import json
import re


def persona_generator_agent(state: TestimonialState):

    prompt = f"""
Generate 3 realistic customer personas for this product.

Product Name: {state["product_name"]}
Industry: {state["industry"]}
Audience: {state["target_audience"]}
Tone: {state["tone"]}

IMPORTANT:
Return ONLY a valid JSON array.
Do not use markdown.
Do not add explanations.

Format:
[
  {{
    "name": "",
    "role": "",
    "experience_level": "",
    "pain_points": "",
    "goals": ""
  }}
]
"""

    response = llm.invoke([
        HumanMessage(content=prompt)
    ])

    raw_output = response.content

    try:
        cleaned_output = re.sub(r"```json|```", "", raw_output).strip()

        personas = json.loads(cleaned_output)

    except Exception as e:

        print("JSON ERROR:", e)
        print("RAW OUTPUT:", raw_output)

        personas = []

    state["personas"] = personas

    return state