import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "node:fs";
import express from "express";
import cors from "cors";

// Get project root (4 levels up from this file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "../../../../");

// Load .env.local first (higher priority), then .env
const envLocalPath = resolve(projectRoot, ".env.local");
const envPath = resolve(projectRoot, ".env");

console.log("🔍 Looking for .env files:");
console.log("  Project root:", projectRoot);
console.log("  .env.local exists:", existsSync(envLocalPath));
console.log("  .env exists:", existsSync(envPath));

if (existsSync(envLocalPath)) {
  const result = dotenv.config({ path: envLocalPath, override: true });
  if (result.error) {
    console.error("❌ Error loading .env.local:", result.error);
  } else {
    console.log("✅ Loaded .env.local");
  }
}
if (existsSync(envPath)) {
  dotenv.config({ path: envPath, override: false });
  console.log("✅ Loaded .env");
}

// Import routes after env is loaded
const { postFatwa } = await import("./routes/fatwa.ts");
const { getDaily } = await import("./routes/daily.ts");

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason: any, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

const app = express();
app.use(cors());
app.use(express.json());

// Initialize services
import('../services/config-service/config.service.js').then(({ configService }) => {
  configService.loadConfig().then(() => {
    console.log('✅ Config service initialized');
  }).catch(err => {
    console.error('⚠️  Config service error:', err.message);
  });
});

import('../services/rag-service/document-manager.js').then(({ documentManager }) => {
  documentManager.init().then(() => {
    console.log('✅ Document manager initialized');
  }).catch(err => {
    console.error('⚠️  Document manager error:', err.message);
  });
});

// Simple test endpoint
app.get("/", (_req, res) => {
  res.json({ message: "XamSaDine API Gateway is running!", status: "ok" });
});

// Test endpoint for fatwa
app.get("/api/fatwa/test", (_req, res) => {
  res.json({
    message: "Fatwa endpoint is accessible",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/fatwa", async (req, res) => {
  try {
    console.log("📨 POST /api/fatwa - Request received");
    await postFatwa(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/fatwa route:", error);
    console.error("   Error type:", error?.constructor?.name);
    console.error("   Error message:", error?.message || error);
    console.error("   Stack:", error?.stack);
    if (!res.headersSent) {
      try {
        res.status(500).json({
          error: "Internal server error",
          message: error?.message || "An unexpected error occurred",
        });
      } catch (responseError) {
        console.error("💥 Could not send error response:", responseError);
      }
    }
  }
});


app.get("/api/daily", async (req, res) => {
  try {
    await getDaily(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/daily route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.post("/api/ask", async (req, res) => {
  try {
    const { askCircle } = await import("./routes/circle.ts");
    await askCircle(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/ask route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

// Council Routes - LLM Council System
app.post("/api/council/ask", async (req, res) => {
  try {
    const { askCouncil } = await import("./routes/council-handler.ts");
    await askCouncil(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/council/ask route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.get("/api/council/members", async (req, res) => {
  try {
    const { getCouncilMembers } = await import("./routes/council-handler.ts");
    getCouncilMembers(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/council/members route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.get("/api/council/health", async (req, res) => {
  try {
    const { healthCheck } = await import("./routes/council-handler.ts");
    healthCheck(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/council/health route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.post("/api/council/documents", async (req, res) => {
  try {
    const { uploadDocument } = await import("./routes/council-handler.ts");
    await uploadDocument(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/council/documents POST route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.get("/api/council/documents", async (req, res) => {
  try {
    const { listDocuments } = await import("./routes/council-handler.ts");
    listDocuments(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/council/documents GET route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.get("/api/council/documents/:docId", async (req, res) => {
  try {
    const { getDocument } = await import("./routes/council-handler.ts");
    getDocument(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/council/documents/:docId GET route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.delete("/api/council/documents/:docId", async (req, res) => {
  try {
    const { deleteDocument } = await import("./routes/council-handler.ts");
    await deleteDocument(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/council/documents/:docId DELETE route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

app.post("/api/council/search", async (req, res) => {
  try {
    const { searchRAG } = await import("./routes/council-handler.ts");
    await searchRAG(req, res);
  } catch (error: any) {
    console.error("💥 Unhandled error in /api/council/search route:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred",
      });
    }
  }
});

// Config routes
app.get("/api/config/agents", async (req, res) => {
  try {
    const { getAgents } = await import("./routes/config.ts");
    await getAgents(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/config/agents:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.post("/api/config/agents/:agentId", async (req, res) => {
  try {
    const { updateAgent } = await import("./routes/config.ts");
    await updateAgent(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/config/agents/:agentId:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.get("/api/config/models", async (req, res) => {
  try {
    const { getModels } = await import("./routes/config.ts");
    await getModels(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/config/models:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

// Document routes
app.post("/api/documents/upload", async (req, res) => {
  try {
    const { uploadMiddleware, uploadDocument } = await import("./routes/documents.ts");
    uploadMiddleware(req, res, async (err: any) => {
      if (err) {
        res.status(500).json({ error: "Upload failed", message: err.message });
        return;
      }
      await uploadDocument(req, res);
    });
  } catch (error: any) {
    console.error("💥 Error in /api/documents/upload:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.get("/api/documents", async (req, res) => {
  try {
    const { listDocuments } = await import("./routes/documents.ts");
    await listDocuments(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/documents:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.delete("/api/documents/:id", async (req, res) => {
  try {
    const { deleteDocument } = await import("./routes/documents.ts");
    await deleteDocument(req, res);
  } catch (error: any) {
    console.error("💥 Error in /api/documents/:id:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error", message: error.message });
    }
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`✅ api-gateway listening on http://localhost:${port}`);
  console.log(`✅ Test: http://localhost:${port}/health`);
}).on("error", (error: any) => {
  console.error("💥 FATAL: Could not start server:", error);
  process.exit(1);
});
