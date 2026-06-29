from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag_service import rag_service

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    query: str
    document_id: str = None

@router.post("")
async def ask_sensei(request: ChatRequest):
    """
    RAG conversation query with contextual document retrieval.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        response = await rag_service.get_response(
            query=request.query,
            document_id=request.document_id
        )
        return {
            "query": request.query,
            "response": response,
            "citations_active": request.document_id is not None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG Conversation failed: {str(e)}")
