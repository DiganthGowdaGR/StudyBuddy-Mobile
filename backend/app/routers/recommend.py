from fastapi import APIRouter, Query, HTTPException
from app.services.generator_service import generator_service

router = APIRouter(prefix="/recommend", tags=["recommend"])

@router.get("")
async def recommend_study_blocks(
    exams: str = Query(..., description="Comma-separated upcoming exams list")
):
    """
    Recommend AI suggested study block times based on upcoming milestone dates.
    """
    if not exams.strip():
        raise HTTPException(status_code=400, detail="Exams list parameter cannot be empty.")

    try:
        plan = await generator_service.generate_study_plan(exams_list=exams)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Study blocks recommendations failed: {str(e)}")
