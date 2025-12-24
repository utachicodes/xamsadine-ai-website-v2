"""
Core RAG pipeline + guided fatwa flow pseudocode for XamSaDine AI v2.

This is not executable yet; it documents the structure and key steps so you
can implement with FastAPI, ChromaDB, and Ollama.
"""

from typing import List, Dict, Any


class VectorClient:
    def query(self, text: str, k: int = 12, filters: Dict[str, Any] | None = None):
        """
        Pseudocode for querying ChromaDB.
        """
        raise NotImplementedError


class LLMClient:
    def generate(self, prompt: str) -> str:
        """
        Pseudocode for calling Ollama or another LLM endpoint.
        """
        raise NotImplementedError


def build_query_from_context(session: Dict[str, Any]) -> str:
    """
    Turn the user question + clarifications into a search query.
    """
    return session["question"]


def guided_fatwa_step(
    session: Dict[str, Any], user_message: str, vector: VectorClient, llm: LLMClient
) -> Dict[str, Any]:
    """
    High-level guided fatwa pipeline:
      1) Collect clarifications if needed
      2) Query ChromaDB by Qur'an/Hadith/Maliki/Local sources
      3) Ask LLM for structured (hukm, evidence, explanation, advice)
    """
    # 1. Conversation update
    session.setdefault("messages", []).append({"role": "user", "content": user_message})

    # 2. (Placeholder) Clarification logic
    # In implementation, use a small LLM prompt to decide if more questions are needed

    # 3. RAG query
    query = build_query_from_context(session)
    docs = vector.query(
        query,
        k=12,
        filters={"jurisprudence": "maliki", "country": "sn"},
    )

    # 4. Prompt LLM for structured fatwa
    prompt = f\"\"\"You are a Maliki scholar serving Muslims in Senegal.
User question (language={session.get('language', 'fr')}):
{session['question']}

Relevant texts (Qur'an, Hadith, Maliki references, local fatawa):
{docs}

Please answer in 4 labelled parts:
1) HUKM: A concise ruling.
2) EVIDENCE: Key Qur'an, Hadith, Maliki, and local references.
3) EXPLANATION: A gentle explanation using clear language.
4) ADVICE: Practical, contextual advice for a Senegalese Muslim.
\"\"\"

    raw = llm.generate(prompt)

    # 5. In the real implementation, parse `raw` into structured JSON
    # For now we just wrap it.
    return {
        "session": session,
        "raw_answer": raw,
    }


