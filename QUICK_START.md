# XamSaDine AI - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Copy your API key from the keys page

### Step 2: Configure Environment

```bash
# In the project root, create .env.local
echo "OPENROUTER_API_KEY=your_key_here" > .env.local
```

### Step 3: Install Dependencies

```bash
bun install
```

### Step 4: Start Backend Server

Open a terminal and run:

```bash
cd backend/services/api-gateway
bun src/server.ts
```

You should see:
```
✅ api-gateway listening on http://localhost:4000
```

### Step 5: Start Frontend

Open another terminal and run:

```bash
bun dev
```

Frontend will be available at `http://localhost:5173`

## 🎯 Try the Council

1. Navigate to **Circle of Knowledge** in the UI
2. Enter a question, for example:
   - "What is the role of ethical considerations in technology?"
   - "How should we approach climate change from multiple perspectives?"
   - "What makes a good leader?"

3. Click "Ask Council"
4. Watch as all 4 council members analyze your question
5. See the synthesis and consensus score

## 📚 Upload Documents

1. Go to the **Knowledge Base** tab
2. Click "Add Document"
3. Fill in:
   - **Title**: Document name
   - **Source**: Where it's from
   - **Category**: Topic category
   - **Content**: Full text
4. Click "Upload Document"

Now when you ask the Council, it will use these documents for context!

## 🔍 Search Knowledge Base

1. Go to the **Search RAG** tab
2. Enter a search query
3. See relevant documents and relevance scores

## 🧑‍💼 Meet the Council Members

| Member | Role | Model | Specialty |
|--------|------|-------|-----------|
| 🧠 The Analyst | Logic & Data | GPT-4o | Structured reasoning |
| ✨ The Visionary | Creativity | Claude Opus | Novel ideas |
| 🛡️ The Guardian | Ethics | Mistral Large | Values & impact |
| 🔍 The Verifier | Critical | Llama 3 | Verification |

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill process using port
kill -9 <PID>

# Or use different port
PORT=5000 bun backend/services/api-gateway/src/server.ts
```

### Frontend can't reach backend
- Ensure backend is running on port 4000
- Check API URL in `.env`: `VITE_API_URL=http://localhost:4000`
- Verify CORS settings in backend

### "API key not found" error
- Check `.env.local` file exists
- Verify API key is correct
- Reload the page after updating `.env.local`

### Slow responses
- Use shorter documents (< 50KB recommended)
- Reduce `topK` for RAG search
- Close other applications

## 📖 Documentation

- **[LLM Council Guide](./LLM_COUNCIL_GUIDE.md)** - Complete system documentation
- **[Deployment Guide](./DEPLOYMENT.md)** - Production setup
- **[API Documentation](./API.md)** - Endpoint reference (if available)

## 🔑 Key Features

✅ **4 Expert LLM Models** via OpenRouter
✅ **Distributed Consensus** - Multiple perspectives
✅ **Peer Review System** - Quality control
✅ **RAG Integration** - Contextual knowledge
✅ **Beautiful UI** - Professional design
✅ **Full API** - RESTful endpoints
✅ **Production Ready** - Deployment guides

## 💡 Pro Tips

1. **Better questions = Better answers**
   - Be specific and clear
   - Provide context
   - Ask one thing at a time

2. **Build your knowledge base**
   - Add relevant documents
   - Use specific categories
   - Include diverse sources

3. **Monitor consensus scores**
   - High (80%+) = Strong agreement
   - Medium (50-80%) = Good reasoning
   - Low (<50%) = Highlight disagreements

4. **Export responses**
   - Download as JSON for analysis
   - Share markdown for collaboration

## 🎓 Learning Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [RAG Pattern Explanation](https://research.ibm.com/blog/retrieval-augmented-generation-RAG)
- [Multi-Agent Systems](https://en.wikipedia.org/wiki/Multi-agent_system)

## 🤝 Need Help?

- Check **Health Status** tab for system status
- Review **Member Details** to understand perspectives
- Use **Search** to find relevant documents

## 🚀 Next Steps

1. ✅ Get API key
2. ✅ Start backend & frontend
3. ✅ Ask the Council a question
4. ✅ Upload your first document
5. ⭐ Share feedback and iterate!

---

**Happy Querying!** 🎯

The Council is ready to help you think through complex problems with multiple expert perspectives.
