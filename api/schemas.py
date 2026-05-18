from pydantic import BaseModel


class TestimonialRequest(BaseModel):

    brand_name: str
    product_name: str
    industry: str
    target_audience: str
    tone: str
    platform: str