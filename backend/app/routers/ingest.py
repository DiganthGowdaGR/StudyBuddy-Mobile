import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.pdf_service import pdf_service
from app.services.vector_service import vector_service

router = APIRouter(prefix="/ingest", tags=["ingest"])

@router.post("")
async def ingest_document(
    file: UploadFile = File(...),
    document_id: str = Form(None)
):
    """
    Accept PDF document upload, parse content text, and store chunk embeddings in Vector Database.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF documents are supported.")

    try:
        # 1. Read bytes
        contents = await file.read()
        
        # 2. Parse text
        text = pdf_service.extract_text_from_bytes(contents)
        if not text.strip():
            raise HTTPException(status_code=422, detail="Parsed PDF is empty or contains no extractable text.")
            
        # 3. Embed & Index
        doc_id = document_id or str(uuid.uuid4())
        result = vector_service.ingest_text(text, doc_id)
        
        return {
            "filename": file.filename,
            "document_id": doc_id,
            "chunks_count": result["chunks_count"],
            "status": "indexed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion pipeline failed: {str(e)}")
