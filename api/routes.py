from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import json
import asyncio
from api.schemas import TestimonialRequest

from graph.workflow import app as workflow_app


router = APIRouter()




@router.post("/generate-testimonials")
def generate_testimonials(request: TestimonialRequest):

    initial_state = {

        "brand_name": request.brand_name,

        "product_name": request.product_name,

        "industry": request.industry,

        "target_audience": request.target_audience,

        "tone": request.tone,

        "platform": request.platform,

        "analysis": "",

        "personas": [],

        "testimonials": [],

        "humanized_testimonials": [],

        "review_scores": [],

        "final_output": [],

        "approved": False,

        "iteration_count": 0,

        "max_iterations": 3
    }

    result = workflow_app.invoke(initial_state)

    return {
        "testimonials": result["humanized_testimonials"],
        "reviews": result["review_scores"]
    }


async def testimonial_stream_generator(request):

    yield json.dumps({
        "event": "status",
        "message": "Starting workflow..."
    }) + "\n"

    await asyncio.sleep(1)

    yield json.dumps({
        "event": "status",
        "message": "Analyzing product..."
    }) + "\n"

    await asyncio.sleep(1)

    yield json.dumps({
        "event": "status",
        "message": "Generating personas..."
    }) + "\n"

    await asyncio.sleep(1)

    yield json.dumps({
        "event": "status",
        "message": "Writing testimonials..."
    }) + "\n"

    await asyncio.sleep(1)

    yield json.dumps({
        "event": "status",
        "message": "Humanizing testimonials..."
    }) + "\n"

    await asyncio.sleep(1)

    yield json.dumps({
        "event": "status",
        "message": "Reviewing outputs..."
    }) + "\n"

    await asyncio.sleep(1)

    initial_state = {

        "brand_name": request.brand_name,

        "product_name": request.product_name,

        "industry": request.industry,

        "target_audience": request.target_audience,

        "tone": request.tone,

        "platform": request.platform,

        "analysis": "",

        "personas": [],

        "testimonials": [],

        "humanized_testimonials": [],

        "review_scores": [],

        "final_output": [],

        "approved": False,

        "iteration_count": 0,

        "max_iterations": 3
    }

    result = workflow_app.invoke(initial_state)

    yield json.dumps({
        "event": "completed",
        "testimonials": result["humanized_testimonials"],
        "reviews": result["review_scores"]
    }) + "\n"




@router.post("/stream-testimonials")
async def stream_testimonials(
    request: TestimonialRequest
):

    return StreamingResponse(
        testimonial_stream_generator(request),
        media_type="text/event-stream"
    )