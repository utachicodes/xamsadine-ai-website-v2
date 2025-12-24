## XamSaDine AI – Backend Skeleton

This folder sketches the backend architecture for XamSaDine AI v2. It is intentionally lightweight so you can plug in your preferred frameworks (FastAPI, Express/Nest, etc.) while keeping the overall structure and contracts stable.

### Services

- `api-gateway` – public HTTP API, auth, rate limiting, orchestration
- `rag-service` – RAG pipeline, guided fatwa flow, Ollama integration
- `audio-service` – Whisper STT and TTS
- `vector-service` – ChromaDB client and ingestion jobs

Each service sub-folder should be a separate deployable unit or container.

### Ollama configuration

For the `api-gateway` (TypeScript + Express) service, configure Ollama via environment variables (optional):

```bash
# Optional: Set custom Ollama URL and model
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:1b
```

The Express server uses `OllamaClient` to call the local Ollama API. Make sure Ollama is running:
- Install: https://ollama.ai
- Run: `ollama serve`
- Pull a model: `ollama pull gemma3:1b`

If Ollama is not available, the server falls back to mock responses. 

