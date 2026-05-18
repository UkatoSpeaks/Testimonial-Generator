from graph.workflow import app


initial_state = {
    "product_name": "AI Resume Analyzer",
    "industry": "SaaS",
    "target_audience": "Developers",
    "tone": "Professional",
    "platform": "LinkedIn",
    "iteration_count": 0,
    "max_iterations": 3,

    "analysis": "",

    "personas": [],
    "testimonials": [],
    "humanized_testimonials": [],
    "review_scores": [],
    "final_output": [],

    "approved": False
}


result = app.invoke(initial_state)


print("\n===== HUMANIZED TESTIMONIALS =====\n")

for testimonial in result["humanized_testimonials"]:
    print(testimonial)
    print("\n----------------------\n")


print("\n===== REVIEW SCORES =====\n")

for review in result["review_scores"]:
    print(review)
    print("\n----------------------\n")