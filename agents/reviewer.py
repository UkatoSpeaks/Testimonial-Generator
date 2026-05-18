from langchain_core.messages import HumanMessage
from config.llm import llm
from graph.state import TestimonialState
import json
import re


def reviewer_agent(state: TestimonialState):

    review_scores = []

    for testimonial in state["humanized_testimonials"]:

        prompt = f"""
Review this testimonial.

Testimonial:
{testimonial}

Evaluate:
1. Human realism
2. Emotional authenticity
3. AI-generated feel
4. Clarity
5. Professional quality

Return ONLY valid JSON.

Format:
{{
    "score": 0-10,
    "approved": true/false,
    "feedback": ""
}}

Approval Rules:
- Approve only if score >= 8
- Reject if too robotic or exaggerated
"""

        response = llm.invoke([
            HumanMessage(content=prompt)
        ])

        raw_output = response.content

        try:
            cleaned_output = re.sub(
                r"```json|```",
                "",
                raw_output
            ).strip()

            review = json.loads(cleaned_output)

        except Exception as e:

            print("REVIEW ERROR:", e)
            print("RAW OUTPUT:", raw_output)

            review = {
                "score": 0,
                "approved": False,
                "feedback": "Parsing failed"
            }

        review_scores.append(review)

    state["review_scores"] = review_scores

    return state