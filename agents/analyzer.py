from langchain_core.messages import HumanMessage
from graph.state import TestimonialState
from config.llm import llm


def analyzer_agent(state: TestimonialState):

    prompt = f"""
Analyze the following testimonial request.

Product Name: {state["product_name"]}
Industry: {state["industry"]}
Audience: {state["target_audience"]}
Tone: {state["tone"]}
Platform: {state["platform"]}

Give a short strategic understanding of:
- ideal customer
- writing style
- emotional direction
"""

    response = llm.invoke([
        HumanMessage(content=prompt)
    ])

    state["analysis"] = response.content

    return state