# Production Deployment Guide

## Prerequisites

- Node.js 18+
- Docker (recommended)
- OpenRouter API account with API key
- MongoDB or file-based storage for vectors/documents

## Environment Setup

### 1. Prepare Environment Variables

```bash
# .env.production
OPENROUTER_API_KEY=sk_xxx_your_key_xxx
PORT=4000
NODE_ENV=production
APP_NAME=XamSaDine AI
APP_VERSION=2.0.0
```

### 2. Install Dependencies

```bash
bun install --production
```

## Backend Deployment

### Option A: Direct Server Deployment

```bash
# Build frontend
bun run build

# Start backend server
cd backend/services/api-gateway
bun src/server.ts
```

### Option B: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install bun and dependencies
RUN npm install -g bun
RUN bun install --production

# Copy source code
COPY . .

# Create data directory for vectors
RUN mkdir -p backend/data

# Expose port
EXPOSE 4000

# Start server
CMD ["bun", "backend/services/api-gateway/src/server.ts"]
```

Build and run:

```bash
docker build -t xamsadine-ai .
docker run -p 4000:4000 \
  -e OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
  xamsadine-ai
```

## Database Setup

### Vector Store (File-based)

The system uses JSON-based vector storage by default. For production, consider:

#### Option 1: PostgreSQL with pgvector

```bash
# Install pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

# Create vector table
CREATE TABLE vectors (
  id TEXT PRIMARY KEY,
  docId TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vectors_docid ON vectors(docId);
CREATE INDEX idx_vectors_embedding ON vectors USING ivfflat (embedding vector_cosine_ops);
```

#### Option 2: Weaviate Vector Database

```bash
# Using Docker
docker run -p 8080:8080 semitechnologies/weaviate:latest
```

#### Option 3: Pinecone (Managed)

```bash
# Sign up at pinecone.io
PINECONE_API_KEY=your_key_here
PINECONE_INDEX=xamsadine
PINECONE_ENVIRONMENT=us-east1-aws
```

## Scaling Considerations

### API Rate Limiting

```typescript
// In server.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/council/ask', limiter);
```

### Load Balancing

```nginx
# nginx.conf
upstream council_api {
    server localhost:4000;
    server localhost:4001;
    server localhost:4002;
}

server {
    listen 80;
    server_name api.xamsadine.ai;

    location /api/council/ {
        proxy_pass http://council_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Horizontal Scaling with PM2

```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'council-api',
    script: 'backend/services/api-gateway/src/server.ts',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};

# Start with PM2
pm2 start ecosystem.config.js
```

## Monitoring

### Health Checks

```bash
# Basic health endpoint
curl http://localhost:4000/api/council/health

# Monitor endpoint (useful for load balancers)
curl http://localhost:4000/health
```

### Logging

```typescript
// src/middleware/logging.ts
import morgan from 'morgan';

app.use(morgan('combined', {
  stream: fs.createWriteStream('logs/access.log', { flags: 'a' })
}));
```

### Performance Metrics

```typescript
// Track API performance
const metrics = {
  councilQueries: 0,
  avgResponseTime: 0,
  errorRate: 0
};

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.avgResponseTime = (metrics.avgResponseTime + duration) / 2;
  });
  next();
});
```

## Security

### HTTPS/TLS

```typescript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/path/to/private.key'),
  cert: fs.readFileSync('/path/to/certificate.crt')
};

https.createServer(options, app).listen(443);
```

### API Authentication

```typescript
// Add API key authentication
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.use('/api/council', apiKeyAuth);
```

### CORS Configuration

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://xamsadine.ai',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
```

## Backups

### Vector Store Backup

```bash
# Daily backup script
0 2 * * * cp -r /app/backend/data /backups/data_$(date +\%Y\%m\%d)

# S3 backup
aws s3 sync /app/backend/data s3://xamsadine-backups/vectors/
```

### Document Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb://..." --out=/backups/mongodb

# PostgreSQL backup
pg_dump xamsadine > /backups/xamsadine_$(date +%Y%m%d).sql
```

## Frontend Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Set environment variables in Vercel dashboard
VITE_API_URL=https://api.xamsadine.ai
```

### Netlify

```bash
# netlify.toml
[build]
  command = "bun run build"
  functions = "backend/services/api-gateway"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - run: bun run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - uses: actions/deploy-pages@v2
        with:
          artifact_name: dist
```

## Performance Optimization

### Caching Strategy

```typescript
// Cache common queries
import Redis from 'redis';

const redis = Redis.createClient();

app.get('/api/council/members', async (req, res) => {
  const cached = await redis.get('council:members');
  if (cached) return res.json(JSON.parse(cached));

  const members = await council.getMembers();
  await redis.setEx('council:members', 3600, JSON.stringify(members));
  res.json(members);
});
```

### Response Compression

```typescript
import compression from 'compression';

app.use(compression());
```

## Troubleshooting

### Check System Status

```bash
# Monitor resource usage
watch -n 1 'ps aux | grep node'

# Check port usage
lsof -i :4000

# View logs
tail -f /var/log/xamsadine/council-api.log
```

### Common Issues

| Issue | Solution |
|-------|----------|
| High memory usage | Reduce vector store in-memory size, implement pagination |
| Slow API responses | Add caching, optimize RAG search, use faster models |
| OpenRouter errors | Check API key, rate limits, model availability |
| Vector search fails | Verify vector store initialization, check embeddings |

## Maintenance

### Regular Tasks

- **Daily**: Monitor logs, check error rates
- **Weekly**: Review performance metrics, test backups
- **Monthly**: Update dependencies, review security logs
- **Quarterly**: Performance optimization, capacity planning

---

**Last Updated**: December 2024
**Deployment Version**: 2.0.0
