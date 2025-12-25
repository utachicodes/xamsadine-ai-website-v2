import express from 'express';
import { OpenRouterClient } from '../../llm-service/openrouter-client';
import { LLMCouncil } from '../../llm-service/llm-council';

const router = express.Router();
const openRouter = new OpenRouterClient();
const llmCouncil = new LLMCouncil();

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
        message: 'Please provide a message to continue'
      });
    }

    // Get response from LLM Council
    const councilResponse = await llmCouncil.processQuery(message);

    // Format the response with language context
    const response = {
      response: councilResponse.synthesisResult,
      council: {
        members: councilResponse.councilMembers.map((m: any) => m.name),
        consensus: councilResponse.synthesisResult,
        reasoning: councilResponse.initialResponses.map((r: any) => r.reasoning) || []
      },
      language: language
    };

    res.json(response);
  } catch (error: any) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process your request. Please try again.'
    });
  }
});

// Health check for chat service
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'chat'
  });
});

export default router;
