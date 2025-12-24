import type { Request, Response } from "express";
import type { FatwaSession } from "../../../../shared/schemas/fatwa.ts";
import { OllamaClient } from "../clients/ollamaClient.ts";

// Lazy-load Ollama client
function getOllamaClient(): OllamaClient | null {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const ollamaModel = process.env.OLLAMA_MODEL || "gemma3:1b";
  
  try {
    return new OllamaClient({
      baseUrl: ollamaUrl,
      model: ollamaModel,
    });
  } catch (error) {
    console.error("Failed to create Ollama client:", error);
    return null;
  }
}

export async function postFatwa(req: Request, res: Response) {
  try {
    console.log("📥 Received fatwa request");
    const { question, language, madhab } = req.body as {
      question: string;
      language: FatwaSession["language"];
      madhab?: "hanafi" | "maliki" | "shafii" | "hanbali";
    };

    if (!question) {
      console.log("❌ Missing question in request");
      return res.status(400).json({ error: "Missing question" });
    }

    console.log("✅ Question received:", question.substring(0, 50) + "...");

    const chosenMadhab = madhab || "maliki";
    const session: FatwaSession = {
      id: "temp",
      language: language ?? "fr",
      question,
      steps: [],
      createdAt: new Date().toISOString(),
    };

    // Try to use Ollama if available
    const ollama = getOllamaClient();
    const hasOllama = ollama !== null;
    console.log(`🔍 Checking Ollama: ${hasOllama ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
    if (hasOllama) {
      console.log("✅ Using Ollama for fatwa generation");
    }
    
    if (ollama) {
      try {
        console.log("🔄 Step 1: Checking if question is Islamic...");
        // 1) Islamic-only guardrail
        const isIslamic = await ollama.isIslamicQuestion(question);
        console.log("   Result:", isIslamic ? "YES - Islamic question" : "NO - Not Islamic");
        
        if (!isIslamic) {
          console.log("🚫 Question rejected (not Islamic)");
          return res.json({
            allowed: false,
            message:
              "XamSaDine is dedicated to Islamic guidance only. Please ask a question related to Islam, worship, ethics, or Muslim life.",
          });
        }

        console.log("🔄 Step 2: Generating fatwa with Ollama...");
        // 2) Generate fatwa with Ollama
        const contextTexts: string[] = []; // TODO: call vector/rag service and fetch relevant passages.
        const raw = await ollama.generateGuidedFatwa(session, contextTexts, chosenMadhab);
        console.log("✅ Ollama response received (length:", raw.length, ")");

        return res.json({
          allowed: true,
          session,
          raw,
          madhab: chosenMadhab,
        });
      } catch (ollamaError: any) {
        console.error("❌ Ollama API error, falling back to mock:");
        console.error("   Error type:", ollamaError?.constructor?.name);
        console.error("   Error message:", ollamaError?.message || ollamaError);
        
        // Check if it's a connection error
        if (ollamaError?.message?.includes("Cannot connect") || ollamaError?.message?.includes("ECONNREFUSED")) {
          console.error("   ⚠️  Cannot connect to Ollama. Make sure Ollama is running:");
          console.error("      - Install: https://ollama.ai");
          console.error("      - Run: ollama serve");
          console.error("      - Pull a model: ollama pull llama3.2");
          console.error("   💡 Falling back to mock response...");
        }
        // Fall through to mock response below
      }
    }

    // MOCK MODE: Always return a structured response (used when Ollama is not available or fails)
    console.log("📝 Using mock response (Ollama not available or failed)");
    const madhabName = chosenMadhab.charAt(0).toUpperCase() + chosenMadhab.slice(1);
    const langText = language === "wo" ? "Wolof" : language === "fr" ? "French" : "English";
    
    const mockResponse = `HUKM: According to the ${madhabName} school of fiqh, your question requires careful consideration. The ruling depends on the specific circumstances you've described.

EVIDENCE: In the ${madhabName} tradition, scholars reference authentic sources from the Qur'an, Sunnah, and the established principles of the madhab. Key texts include the foundational works of ${madhabName} jurisprudence.

EXPLANATION: Your question "${question}" touches on important aspects of Islamic guidance. The ${madhabName} school approaches such matters with careful attention to both textual evidence and practical application, considering the context and circumstances involved.

ADVICE: It is recommended to consult with a qualified scholar who is well-versed in ${madhabName} fiqh for detailed guidance tailored to your specific situation. This response serves as general information and should be supplemented with proper scholarly consultation.`;

    console.log("✅ Sending mock response");
    return res.json({
      allowed: true,
      session,
      raw: mockResponse,
      madhab: chosenMadhab,
    });
  } catch (error: any) {
    console.error("💥 FATAL ERROR in postFatwa:");
    console.error("   Error type:", error?.constructor?.name);
    console.error("   Error message:", error?.message || error);
    console.error("   Stack:", error?.stack);
    
    // Always send a response, even on error
    try {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message || "An error occurred while processing your request",
      });
    } catch (responseError) {
      console.error("💥 Could not send error response:", responseError);
    }
  }
}


