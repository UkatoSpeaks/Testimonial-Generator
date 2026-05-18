from langchain_core.messages import HumanMessage
from config.llm import llm
from graph.state import TestimonialState


def rewriter_agent(state: TestimonialState):

    rewritten_testimonials = []

    for index, testimonial in enumerate(state["humanized_testimonials"]):

        feedback = state["review_scores"][index]["feedback"]

        prompt = f"""
Rewrite this testimonial using the reviewer feedback.

Original Testimonial:
{testimonial}

Reviewer Feedback:
{feedback}

Requirements:
- Make it more human sounding
- Improve realism
- Remove robotic phrasing
- Keep it concise
- Keep it believable

Return ONLY the improved testimonial.
"""

        response = llm.invoke([
            HumanMessage(content=prompt)
        ])

        rewritten_testimonials.append(response.content)

    state["humanized_testimonials"] = rewritten_testimonials

    return state