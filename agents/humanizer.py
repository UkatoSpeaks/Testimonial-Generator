from langchain_core.messages import HumanMessage
from config.llm import llm
from graph.state import TestimonialState

def humanizer_agent(state: TestimonialState):
    humanized_testimonials=[]
    for testimonial in state["testimonials"]:

        prompt=f"""
Humanize the testimonial/

Testimonial: {testimonial}

Requirements:
- Make it sound natural and conversational.
- Remove robotic or overly polished phrasing.
- Remove markdown formatting.
- Remove headings or labels.
- Keep it realistic.
- Keep it concise
- Make it sound like a genuine customer
- Do not exaggerate 

Return only the improved testimonial
"""
        
        response = llm.invoke([HumanMessage(content=prompt)])
        humanized_testimonials.append(response.content.strip())

        state["humanized_testimonials"]=humanized_testimonials
        return state