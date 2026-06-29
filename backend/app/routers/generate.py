from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.generator_service import generator_service

router = APIRouter(prefix="/generate", tags=["generate"])

class GenerationRequest(BaseModel):
    context: str
    count: int = 5

@router.post("/cards")
async def generate_cards(request: GenerationRequest):
    """
    Generate structured flashcard arrays from note details.
    """
    if not request.context.strip():
        raise HTTPException(status_code=400, detail="Context text cannot be empty.")

    try:
        cards = await generator_service.generate_flashcards(
            text_context=request.context,
            count=request.count
        )
        return cards
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Card generation failed: {str(e)}")

@router.post("/quiz")
async def generate_quiz(request: GenerationRequest):
    """
    Generate structured MCQ quizzes from note details.
    """
    if not request.context.strip():
        raise HTTPException(status_code=400, detail="Context text cannot be empty.")

    try:
        quiz = await generator_service.generate_quiz(
            text_context=request.context,
            count=request.count
        )
        return quiz
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")
