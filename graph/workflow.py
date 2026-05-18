from langgraph.graph import StateGraph, END

from graph.state import TestimonialState

from agents.rewriter import rewriter_agent
from agents.analyzer import analyzer_agent
from agents.persona import persona_generator_agent
from agents.writer import testimonial_writer_agent
from agents.humanizer import humanizer_agent
from agents.reviewer import reviewer_agent


workflow = StateGraph(TestimonialState)


def reviewer_router(state: TestimonialState):

    reviews = state["review_scores"]

    all_approved = all(
        review["approved"]
        for review in reviews
    )

    if all_approved:
        return "approved"

    if state["iteration_count"] >= state["max_iterations"]:
        return "max_iterations"

    return "rewriter"

workflow.add_node("analyzer", analyzer_agent)

workflow.add_node("persona_generator", persona_generator_agent)

workflow.add_node("writer", testimonial_writer_agent)

workflow.add_node("humanizer", humanizer_agent)

workflow.add_node("reviewer", reviewer_agent)

workflow.add_node("rewriter", rewriter_agent)


workflow.set_entry_point("analyzer")

workflow.add_edge("analyzer", "persona_generator")

workflow.add_edge("persona_generator", "writer")

workflow.add_edge("writer", "humanizer")

workflow.add_edge("humanizer", "reviewer")


workflow.add_conditional_edges(
    "reviewer",
    reviewer_router,
    {
        "approved": END,
        "rewriter": "rewriter",
        "max_iterations": END
    }
)

# IMPORTANT LOOP
workflow.add_edge("rewriter", "humanizer")


app = workflow.compile()