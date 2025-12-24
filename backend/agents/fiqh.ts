import { FiqhResponse, Madhhab, FiqhRuling } from '../shared/types';
import { configService } from '../services/config-service/config.service';
import { llmService } from '../services/llm-service/llm.service';

// Mock Knowledge Base for demonstration (fallback if LLM not configured)
const FIQH_KNOWLEDGE: Record<string, Partial<Record<Madhhab, FiqhRuling>>> = {
    "crypto": {
        "Hanafi": {
            madhhab: "Hanafi",
            hukm: "Permissible (Halal) with conditions",
            dalil: "General permissibility of trade (Asl fi al-ashya al-ibahah)",
            reasoning: "Crypto is considered 'Mal' (property) as it has 'Mutaqawwam' (value) and public acceptance."
        },
        "Shafi": {
            madhhab: "Shafi",
            hukm: "Cautionary / Disliked",
            dalil: "Risk of Gharar (Uncertainty)",
            reasoning: "High volatility may resemble gambling (Maysir), but not strictly prohibited if underlying utility exists."
        }
    },
    "interest": {
        "Hanafi": { madhhab: "Hanafi", hukm: "Haram", dalil: "Quran 2:275", reasoning: "Riba is strictly prohibited." },
        "Maliki": { madhhab: "Maliki", hukm: "Haram", dalil: "Quran 2:275", reasoning: "Riba is strictly prohibited." },
        "Shafi": { madhhab: "Shafi", hukm: "Haram", dalil: "Quran 2:275", reasoning: "Riba is strictly prohibited." },
        "Hanbali": { madhhab: "Hanbali", hukm: "Haram", dalil: "Quran 2:275", reasoning: "Riba is strictly prohibited." }
    }
};

export class FiqhAgent {
    async process(query: string): Promise<FiqhResponse> {
        const lowerQuery = query.toLowerCase();

        // Get agent configuration
        const config = await configService.getAgentConfig('fiqh');

        let rulings: Record<Madhhab, FiqhRuling | null> = {} as Record<Madhhab, FiqhRuling>;
        let confidence = 0.1;

        if (config && config.enabled && config.llmConfig.apiKey) {
            // Use LLM for real reasoning
            try {
                const prompt = `You are a Fiqh scholar. Analyze this question from all 4 Sunni Madhhabs (Hanafi, Maliki, Shafi, Hanbali).

Question: ${query}

For each Madhhab, provide:
- Hukm (ruling): Brief, clear ruling
- Dalil (evidence): Primary source (Quran/Hadith reference)
- Reasoning: Why this Madhhab holds this view (2 sentences max)

Format your response as JSON:
{
  "Hanafi": {"madhhab": "Hanafi", "hukm": "...", "dalil": "...", "reasoning": "..."},
  "Maliki": {"madhhab": "Maliki", "hukm": "...", "dalil": "...", "reasoning": "..."},
  "Shafi": {"madhhab": "Shafi", "hukm": "...", "dalil": "...", "reasoning": "..."},
  "Hanbali": {"madhhab": "Hanbali", "hukm": "...", "dalil": "...", "reasoning": "..."}
}`;

                const response = await llmService.generate(config.llmConfig, prompt);
                const parsed = JSON.parse(response);
                rulings = parsed;
                confidence = 0.9;
            } catch (error) {
                console.error('[FiqhAgent] LLM call failed, using fallback:', error);
                // Fall back to mock data
                const topic = Object.keys(FIQH_KNOWLEDGE).find(k => lowerQuery.includes(k));
                rulings = topic ? (FIQH_KNOWLEDGE[topic] as Record<Madhhab, FiqhRuling>) : {} as Record<Madhhab, FiqhRuling>;
                confidence = topic ? 0.6 : 0.1;
            }
        } else {
            // No API key configured, use mock data
            const topic = Object.keys(FIQH_KNOWLEDGE).find(k => lowerQuery.includes(k));
            rulings = topic ? (FIQH_KNOWLEDGE[topic] as Record<Madhhab, FiqhRuling>) : {} as Record<Madhhab, FiqhRuling>;
            confidence = topic ? 0.6 : 0.1;
        }

        return {
            agentId: "agent-fiqh-v1",
            agentType: "FIQH",
            timestamp: new Date().toISOString(),
            confidence,
            trace: [
                `Received query: "${query}"`,
                config?.llmConfig.apiKey ? `Using ${config.llmConfig.provider} (${config.llmConfig.model})` : 'Using mock data (no API key)',
                `Retrieved rulings for ${Object.keys(rulings).length} Madhhabs`
            ],
            rulings: rulings
        };
    }
}
