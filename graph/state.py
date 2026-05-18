from typing import TypedDict, List, Optional

class TestimonialState(TypedDict):
    product_name:str
    industry:str
    target_audience:str
    tone:str
    platform:str

    personas:List[dict]

    testimonials: List[str]

    humanized_testimonials: List[str]

    review_scores: List[dict]

    final_output: List[str]

    approved: bool

    iteration_count: int
    max_iterations: int

    brand_name:"str"

    analysis:str