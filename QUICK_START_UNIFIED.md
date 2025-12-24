# 🚀 XamSaDine AI - Complete Setup

## Everything in One Command

```bash
npm run dev
```

That's it! This starts:
- ✅ Node.js API Gateway (port 4000)
- ✅ Python Translation Service (port 5000 - auto-managed)
- ✅ All services and features
- ✅ Wolof language support

---

## First Time Setup

### 1. Install Dependencies

```bash
# Node.js packages
npm install

# Python packages for translation
cd backend/services/translation-service
pip install -r requirements.txt
cd ../../..
```

### 2. Start Everything

```bash
npm run dev
```

### 3. Wait for Ready Message

Look for:
```
✅ Translation service started successfully
✅ api-gateway listening on http://localhost:4000
```

### 4. Test It Works

```bash
# Test API
curl http://localhost:4000/health

# Test Wolof translation
curl -X POST http://localhost:4000/api/council/translate-to-wolof \
  -H "Content-Type: application/json" \
  -d '{"text": "Bonjour"}'
```

---

## What Gets Started Automatically

1. **Express API Gateway**
   - Listens on port 4000
   - Handles all HTTP requests
   - Manages all business logic

2. **Python Translation Service**
   - Runs on port 5000
   - Handles Wolof translations
   - Automatically started by API gateway
   - **No separate terminal needed!**

3. **LLM Council**
   - Multiple AI models
   - Peer review system
   - Decision synthesis

4. **RAG System**
   - Document management
   - Vector search
   - Context retrieval

---

## Available Features

### Ask in French
```bash
curl -X POST http://localhost:4000/api/council/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Qu\u0027est-ce que..."}'
```

### Ask in Wolof
```bash
curl -X POST http://localhost:4000/api/council/ask-wolof \
  -H "Content-Type: application/json" \
  -d '{"question": "Naka..."}'
```

### Translate Text
```bash
# French → Wolof
curl -X POST http://localhost:4000/api/council/translate-to-wolof \
  -H "Content-Type: application/json" \
  -d '{"text": "Bonjour"}'

# Wolof → French
curl -X POST http://localhost:4000/api/council/translate-to-french \
  -H "Content-Type: application/json" \
  -d '{"text": "Salaam"}'
```

### Upload Documents
```bash
curl -X POST http://localhost:4000/api/council/documents \
  -H "Content-Type: application/json" \
  -d '{
    "docId": "doc1",
    "title": "My Document",
    "content": "Content here",
    "source": "manual"
  }'
```

---

## Stopping the Service

Press `Ctrl+C` in the terminal. The system will:
1. Stop the translation service gracefully
2. Close the API gateway
3. Clean up all resources

---

## Logs

Both Node.js and Python logs appear in the same console:

```
✅ Config service initialized
🚀 Starting translation service...
✅ Translation service started successfully
[TranslationService] Loading model...
✅ api-gateway listening on http://localhost:4000
```

---

## Troubleshooting

### "Module not found" error
```bash
npm install
pip install -r backend/services/translation-service/requirements.txt
```

### "Port 4000 in use"
```bash
# Kill process on port 4000
# Windows: netstat -ano | findstr :4000
# Then: taskkill /PID <PID> /F
```

### Translation service not starting
```bash
# Check Python installation
python --version

# Manually test translation service
cd backend/services/translation-service
python app.py
```

### First run is slow
⏳ First run downloads the Wolof translation model (~1.2GB)  
This takes 5-10 minutes. Subsequent runs are much faster! ✅

---

## Next: Frontend Integration

The backend is ready. Next steps:
1. Start the frontend: `npm run dev` (in src/ directory if separate)
2. Connect to API at `http://localhost:4000`
3. Add Wolof language selector to UI

---

## Production

When deploying:

```bash
# Build
npm run build

# Start
npm start
```

Everything runs as a single unified service. Perfect for:
- Cloud deployment (AWS, GCP, Azure)
- Docker containerization
- Single-machine setup
- Microservices orchestration

---

**You're all set!** 🎉

Just run `npm run dev` and everything is ready to use.
