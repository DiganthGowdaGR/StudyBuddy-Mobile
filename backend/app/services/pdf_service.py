import io
from pypdf import PdfReader

class PDFService:
    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes) -> str:
        """
        Extract text from raw PDF bytes.
        """
        try:
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            extracted_text = []
            
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
                    
            return "\n\n".join(extracted_text)
        except Exception as e:
            raise RuntimeError(f"Failed to parse PDF document text: {str(e)}")

pdf_service = PDFService()
