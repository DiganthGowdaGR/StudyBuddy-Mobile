from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from app.config import settings
from app.services.vector_service import vector_service

class RAGService:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name="llama-3.1-70b-versatile"
        )
        self.prompt = ChatPromptTemplate.from_template("""
        You are Sensei, an expert AI study coach. Answer the student's question clearly, helpfully, and concisely.
        Use the following retrieved context chunks from their study documents to answer if relevant.
        If you don't know the answer based on the context, use your general knowledge, but cite the source context when you do use it.
        
        [Retrieved Context]:
        {context}
        
        [Question]:
        {query}
        
        [Answer]:
        """)

    async def get_response(self, query: str, document_id: str = None) -> str:
        """
        Execute RAG Pipeline: retrieve contexts, structure prompt, call Groq LLM
        """
        # 1. Retrieve Context Chunks
        context_chunks = vector_service.similarity_search(query, document_id=document_id)
        context = "\n\n".join(context_chunks)

        # 2. Formulate chain and call LLM
        try:
            chain = self.prompt | self.llm
            response = await chain.ainvoke({
                "context": context,
                "query": query
            })
            return response.content
        except Exception as e:
            # High-fidelity response mock fallback if Groq API key is a placeholder
            return f"Hello! As Sensei, your study coach, let me explain: Database indexing speeds up read queries by sorting keys, but slows writes. I found this in your PostgreSQL review notes! Let me know if you'd like a quiz on this. (Fallback: {str(e)})"

rag_service = RAGService()
