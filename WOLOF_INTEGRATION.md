# Wolof Language Support Integration

## Overview

The XamSaDine AI platform now supports Wolof language with full bidirectional translation using Galsen AI's fine-tuned transformer model for Wolof-French translation.

## Architecture

### Components

1. **Python Translation Service** (Microservice)
   - Framework: Flask
   - Location: `backend/services/translation-service/`
   - Model: Galsen AI's `wolofToFrenchTranslator_nllb`
   - Languages: French ↔ Wolof

2. **TypeScript Client**
   - Location: `backend/services/translation-service/client.ts`
   - Integrates with main API Gateway
   - Handles HTTP communication

3. **API Endpoints** (New)
   - `/api/council/translate-to-wolof` - Translate French to Wolof
   - `/api/council/translate-to-french` - Translate Wolof to French
   - `/api/council/ask-wolof` - Ask council in Wolof (with auto-translation)
   - `/api/council/detect-language` - Detect language (French/Wolof)

## Setup & Deployment

### 1. Install Python Dependencies

```bash
cd backend/services/translation-service
pip install -r requirements.txt
```

**Dependencies:**
- `transformers>=4.30.0` - Hugging Face transformers library
- `torch>=2.0.0` - PyTorch (CPU or GPU)
- `flask>=2.3.0` - Web framework
- `python-dotenv>=1.0.0` - Environment configuration

### 2. Start Translation Service

```bash
cd backend/services/translation-service
python app.py
```

**Output:**
```
✅ Translation service running on http://localhost:5000
```

Default port: `5000` (configurable via `TRANSLATION_PORT` env var)

### 3. Configure API Gateway

Set environment variable:
```bash
export TRANSLATION_SERVICE_URL=http://localhost:5000
```

Default: `http://localhost:5000`

### 4. Start Main API Gateway

```bash
cd backend/services/api-gateway
npm run dev
```

## API Usage Examples

### Translate to Wolof

```bash
curl -X POST http://localhost:4000/api/council/translate-to-wolof \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bonjour"
  }'
```

**Response:**
```json
{
  "success": true,
  "text": "Salaam alekum"
}
```

### Translate to French

```bash
curl -X POST http://localhost:4000/api/council/translate-to-french \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Naka nga def?"
  }'
```

### Ask Council in Wolof

```bash
curl -X POST http://localhost:4000/api/council/ask-wolof \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Naka ay dalal yi..."
  }'
```

**Flow:**
1. Wolof question detected/translated to French
2. French query sent to LLM Council
3. Council response received
4. Response translated back to Wolof
5. Wolof response returned to client

### Detect Language

```bash
curl -X POST http://localhost:4000/api/council/detect-language \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world"
  }'
```

**Response:**
```json
{
  "language": "fr",
  "text": "Hello world"
}
```

## Model Information

**Galsen AI Wolof Translator**
- Model: `galsenai/wolofToFrenchTranslator_nllb`
- Base: NLLB-200 architecture (Meta)
- Fine-tuned: By Galsen AI community for Wolof
- Size: ~1.2GB
- Download time: ~5 minutes (first run)
- Inference speed: ~2-5 seconds per sentence (depends on hardware)

**Official Repository**
- https://github.com/Galsenaicommunity/Wolof-NMT
- Includes both model and implementation examples

**GPU Support:**
- Automatically uses CUDA if available
- Falls back to CPU if GPU not found

## Using the Official API

The translator matches the official Galsen AI API:

```python
from translator import FrenchWolofTranslator

translator = FrenchWolofTranslator(
    model_checkpoint="galsenai/wolofToFrenchTranslator_nllb"
)

# Method 1: Using convenience methods
wolof = translator.translate_french_to_wolof("Bonjour")
french = translator.translate_wolof_to_french("Naka nga def?")

# Method 2: Using generic translate method
wolof = translator.translate("Bonjour", source_lang="fr")
french = translator.translate("Naka nga def?", source_lang="wo")
```

## Environment Variables

### Translation Service
```bash
TRANSLATION_MODEL=galsenai/wolofToFrenchTranslator_nllb  # Model checkpoint
TRANSLATION_PORT=5000                                    # Service port
```

### API Gateway
```bash
TRANSLATION_SERVICE_URL=http://localhost:5000            # Service URL
```

## Files Structure

```
backend/services/translation-service/
├── wolof_translator.py      # Core translation logic (FrenchWolofTranslator)
├── app.py                   # Flask API server
├── client.ts                # TypeScript client
└── requirements.txt         # Python dependencies
```

## Features

✅ Bidirectional translation (French ↔ Wolof)  
✅ Auto-language detection  
✅ Batch translation support  
✅ Health check endpoint  
✅ Error handling & validation  
✅ CUDA GPU acceleration (optional)  
✅ Comprehensive logging  
✅ Compatible with official Galsen AI API

## Troubleshooting

### Issue: "Connection refused" to translation service

**Solution:**
1. Ensure translation service is running: `python app.py`
2. Check port is correct (default: 5000)
3. Verify `TRANSLATION_SERVICE_URL` environment variable is set

### Issue: Model download fails

**Solution:**
1. Check internet connection
2. Ensure disk space available (~1.5GB)
3. Set Hugging Face cache: `export HF_HOME=/path/to/cache`

### Issue: Out of memory

**Solution:**
1. Use GPU with CUDA enabled
2. Reduce batch size (code default is single translations)
3. Monitor memory with: `nvidia-smi` (GPU) or `top` (CPU)

### Issue: Slow translation

**Solution:**
1. GPU acceleration: Install CUDA-enabled PyTorch
2. First run downloads model (~5 min), subsequent runs are faster
3. Model caching: Downloaded model is cached locally in `~/.cache/huggingface`

## Testing

Test the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "translation-service",
  "model": "galsenai/wolofToFrenchTranslator_nllb",
  "device": "cuda" or "cpu"
}
```

## Integration with Frontend

The frontend can now:

1. **Language Detection:**
   - Automatically detect user's language preference
   - Switch between French and Wolof UI

2. **Wolof Input:**
   - Accept Wolof text in question input
   - Auto-translate to French for processing
   - Translate response back to Wolof

3. **Language Toggle:**
   - Add Wolof to language selector
   - Persist user preference
   - Default to system language

## Production Deployment

### Docker Deployment

Translation service can be containerized:

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

### Load Balancing

For high traffic, consider:
- Running multiple translation service instances
- Load balancer (nginx, HAProxy)
- Task queue (Celery) for async translations

### Caching

For frequently translated texts:
- Implement Redis caching
- Cache hit rate: ~60-70% typical for FAQs

## Next Steps

1. ✅ **Core Integration Complete** - Translation service ready
2. ⏳ **Frontend Integration** - Add Wolof UI components
3. ⏳ **Testing** - End-to-end Wolof query testing
4. ⏳ **v2.1 Release** - Tag with Wolof support

## Support & Resources

**Issues or Questions:**
- Galsen AI Repository: https://github.com/Galsenaicommunity/Wolof-NMT
- Model Card: https://huggingface.co/galsenai/wolofToFrenchTranslator_nllb
- HuggingFace Forum: https://huggingface.co/

**References:**
- NLLB Base Model: https://huggingface.co/facebook/nllb-200
- Wolof Language Code: `wo` or `wol_Latn`
- Meta AI Research: https://github.com/facebookresearch/nllb
