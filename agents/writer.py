from langchain_core.messages import HumanMessage
from config.llm import llm
from graph.state import TestimonialState
from vectorstore.retriever import get_retriever


def testimonial_writer_agent(state: TestimonialState):

    testimonials = []

    retriever = get_retriever(
        state["brand_name"]
    )

    retrieved_docs = retriever.invoke(
        state["product_name"]
    )

    context = "\n".join(
        [doc.page_content for doc in retrieved_docs]
    )

    for persona in state["personas"]:

        prompt = f"""
Write a realistic testimonial.

Company Context:
{context}

Product: {state["product_name"]}
Industry: {state["industry"]}
Audience: {state["target_audience"]}
Tone: {state["tone"]}
Platform: {state["platform"]}

Customer Persona:
Name: {persona["name"]}
Role: {persona["role"]}
Experience Level: {persona["experience_level"]}
Pain Points: {persona["pain_points"]}
Goals: {persona["goals"]}

Requirements:
- Sound human
- Use the company context naturally
- Mention realistic product benefits
- Be concise (1-3 sentences)
- Avoid robotic phrasing
- Make it believable
"""

        response = llm.invoke([
            HumanMessage(content=prompt)
        ])

        testimonials.append(response.content)

    state["testimonials"] = testimonials

    return state