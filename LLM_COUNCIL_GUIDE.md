# XamSaDine AI - LLM Council Platform

## 🎯 Overview

The **LLM Council** is a sophisticated distributed multi-agent consensus system that leverages four diverse language models to provide nuanced, well-reasoned responses to complex questions. The system implements peer review and consensus scoring to deliver high-quality analysis from multiple expert perspectives.

### Key Features

- **4 Diverse LLM Models** via OpenRouter:
  - **The Analyst** (GPT-4o) - Logic & Data Expert
  - **The Visionary** (Claude 3 Opus) - Creative & Innovation Expert
  - **The Guardian** (Mistral Large) - Ethics & Wellbeing Expert
  - **The Verifier** (Llama 3 70B) - Critical Analysis Expert

- **Distributed Consensus System**:
  - Each model responds independently to queries
  - Peer review between all members
  - Consensus scoring based on agreement levels
  - Synthesis of diverse viewpoints

- **Retrieval-Augmented Generation (RAG)**:
  - Vector-based semantic search
  - Document ingestion and chunking
  - Contextual information retrieval
  - Source attribution

## 🏗️ Architecture

### Backend Services

#### 1. **LLM Service** (`backend/services/llm-service/`)
- `openrouter-client.ts` - OpenRouter API integration
- `llm-council.ts` - Multi-agent consensus engine

#### 2. **RAG Service** (`backend/services/rag-service/`)
- Vector store management
- Document ingestion
- Semantic search
- Source tracking

#### 3. **API Gateway** (`backend/services/api-gateway/`)
- REST endpoints for council operations
- Document management
- Health monitoring

### Frontend Components

#### Pages
- `CircleCouncil.tsx` - Main Council interface with tabs
- `Dashboard.tsx` - Overview and quick access
- `DocumentUpload.tsx` - Knowledge base management

#### Components
- `CouncilDisplay.tsx` - Council visualizations
  - `CouncilMembersDisplay` - Member profiles
  - `CouncilQueryForm` - Query interface
  - `ConsensusScoreDisplay` - Score visualization
  - `DocumentUploadForm` - Document form

#### Hooks
- `use-council.ts` - Council API integration with React Query

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- OpenRouter API key (free tier available)
- Bun package manager

### Setup

1. **Environment Configuration**
```bash
# Copy the example env file
cp .env.example .env.local

# Add your OpenRouter API key
OPENROUTER_API_KEY=your_key_here
```

2. **Install Dependencies**
```bash
bun install
```

3. **Start Backend Server**
```bash
cd backend/services/api-gateway
bun src/server.ts
# Server runs on http://localhost:4000
```

4. **Start Frontend Development**
```bash
bun dev
# Frontend runs on http://localhost:5173
```

## 📚 API Endpoints

### Council Endpoints

#### Ask Council
```
POST /api/council/ask
Content-Type: application/json

{
  "query": "Your question here",
  "useRAG": true,
  "topK": 5
}

Response:
{
  "success": true,
  "data": {
    "query": "...",
    "councilMembers": [...],
    "initialResponses": [...],
    "peerReviews": [...],
    "synthesisResult": "...",
    "consensusScore": 0.85,
    "executionTime": 12500
  }
}
```

#### Get Council Members
```
GET /api/council/members

Response:
{
  "success": true,
  "data": [
    {
      "id": "member-logic",
      "name": "The Analyst",
      "role": "Logic & Data Expert",
      "modelId": "openai/gpt-4o",
      "temperature": 0.2
    },
    ...
  ]
}
```

### Document Management

#### Upload Document
```
POST /api/council/documents
Content-Type: application/json

{
  "docId": "doc-123",
  "title": "Islamic Finance Guide",
  "content": "Full document text...",
  "source": "Islamic Finance Association",
  "category": "islamic"
}

Response:
{
  "success": true,
  "message": "Document ingested successfully",
  "docId": "doc-123"
}
```

#### List Documents
```
GET /api/council/documents

Response:
{
  "success": true,
  "data": [
    {
      "id": "doc-123",
      "title": "Islamic Finance Guide",
      "uploadedAt": "2024-12-24T...",
      "category": "islamic",
      "source": "..."
    }
  ],
  "count": 1
}
```

#### Delete Document
```
DELETE /api/council/documents/:docId

Response:
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### RAG Search

#### Search Knowledge Base
```
POST /api/council/search
Content-Type: application/json

{
  "query": "What is halal financing?",
  "topK": 5
}

Response:
{
  "success": true,
  "data": {
    "context": "...",
    "sources": [
      {"title": "...", "source": "..."}
    ],
    "relevanceScore": 0.92
  }
}
```

## 🔧 Configuration

### OpenRouter Models

The system supports these models (can be customized):

| Model | Provider | Use Case | Context Window |
|-------|----------|----------|-----------------|
| Claude 3 Opus | Anthropic | Synthesis, reasoning | 200K |
| GPT-4o | OpenAI | Logic, analysis | 128K |
| Mistral Large | Mistral AI | Ethics, nuance | 32K |
| Llama 3 70B | Meta | Verification, critique | 8K |

### RAG Configuration

```typescript
// In rag.service.ts
const CHUNK_SIZE = 500;           // Characters per chunk
const CHUNK_OVERLAP = 100;        // Overlap between chunks
const VECTOR_DB_PATH = '...';     // Vector store location
const DOCUMENTS_DB_PATH = '...';  // Document metadata location
```

## 🎨 Frontend Usage

### Using the Council Hook

```typescript
import { useCouncil } from '@/hooks/use-council';

function MyComponent() {
  const council = useCouncil();

  // Ask the council
  const askQuestion = async () => {
    const result = await council.ask({ 
      query: "Your question",
      useRAG: true 
    });
    console.log(result.synthesisResult);
  };

  // Upload document
  const uploadDoc = async () => {
    await council.uploadDocument({
      docId: 'unique-id',
      title: 'Document Title',
      content: 'Full content...',
      source: 'Source',
      category: 'islamic'
    });
  };

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

### Using Components

```typescript
import { CouncilQueryForm, CouncilMembersDisplay } from '@/components/council/CouncilDisplay';

<CouncilQueryForm 
  onSubmit={handleAskCouncil} 
  isLoading={isLoading} 
/>

<CouncilMembersDisplay 
  members={members} 
  isLoading={isLoading} 
/>
```

## 📊 How It Works

### 1. Query Processing
- User submits a question
- System retrieves relevant context from RAG (if enabled)
- Query sent to all 4 council members in parallel

### 2. Initial Responses
- Each member analyzes the question independently
- Extracts confidence levels and reasoning
- Returns structured response

### 3. Peer Review
- Each member reviews responses from others
- Provides evaluation, strengths, weaknesses
- Assigns confidence score (1-10)

### 4. Consensus Synthesis
- Advanced synthesizer combines all perspectives
- Balances agreement and disagreement
- Creates final comprehensive answer

### 5. Scoring
- Consensus score based on:
  - Member confidence levels (30%)
  - Peer review scores (40%)
  - Agreement variance (30%)

## 📈 Performance Metrics

- **Average Response Time**: 10-15 seconds
- **Consensus Score**: 0-1 (higher is better agreement)
- **RAG Relevance Score**: 0-1 (higher is more relevant)
- **Throughput**: ~10 queries/minute per instance

## 🔐 Security Considerations

- API keys should never be committed
- Use `.env.local` for local development
- OpenRouter requests are HTTPS encrypted
- Vector store can be encrypted at rest
- Document content is stored locally

## 🧪 Testing

### Health Check
```bash
curl http://localhost:4000/api/council/health
```

### Test Query
```bash
curl -X POST http://localhost:4000/api/council/ask \
  -H "Content-Type: application/json" \
  -d '{"query":"What is the role of the council?"}'
```

## 📝 Development Notes

### Adding a New Model
1. Add to `COUNCIL_MODELS` in `openrouter-client.ts`
2. Create new `CouncilMember` in `llm-council.ts`
3. Update UI icons if needed

### Extending RAG
1. Add new document category in form
2. Customize chunking strategy in `rag.service.ts`
3. Tune embedding model if needed

### Customizing Prompts
- Edit system prompts in `LLMCouncil` constructor
- Adjust temperature for creativity/consistency tradeoff
- Modify synthesis prompt for different focus

## 🚨 Troubleshooting

### Council Not Responding
- Check OpenRouter API key is set
- Verify network connectivity
- Check OpenRouter service status

### RAG Not Finding Documents
- Ensure documents uploaded successfully
- Check vector store is initialized
- Verify search query quality

### Slow Responses
- Reduce `topK` for RAG search
- Check OpenRouter rate limits
- Consider using faster models (Mistral, Llama)

## 📚 Further Reading

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Semantic Search & Embeddings](https://en.wikipedia.org/wiki/Semantic_search)
- [Multi-Agent Systems](https://en.wikipedia.org/wiki/Multi-agent_system)
- [RAG Pattern](https://research.ibm.com/blog/retrieval-augmented-generation-RAG)

## 📄 License

See LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows the existing style
- All API changes are documented
- Backend tests pass
- Frontend builds without errors

---

**XamSaDine AI v2.0** - Bringing Collective Intelligence to Islamic Knowledge
