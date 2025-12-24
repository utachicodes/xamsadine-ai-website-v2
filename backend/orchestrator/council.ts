import { CouncilAgent } from '../agents/council-agent';
import { llmService } from '../services/llm-service/llm.service';
import { CouncilAgentResponse, SynthesisResult } from '../shared/types';
import { LLMConfig } from '../shared/config-types';
import { ragService } from '../services/rag-service/rag.service';

export class CouncilOrchestrator {
    private agents: CouncilAgent[];
    private debateConfig: LLMConfig;

    constructor() {
        // Define common model config (can be customized per agent in a real app)
        const modelConfig: LLMConfig = {
            provider: 'openrouter',
            model: 'openai/gpt-4o', // Effective reasoning model
            apiKey: process.env.OPENROUTER_API_KEY,
            temperature: 0.7
        };

        // Initialize the Council Members
        this.agents = [
            new CouncilAgent(
                'agent-logic',
                'The Analyst (Logic)',
                'You are The Analyst. Analyze the query using pure logic, data, and cause-and-effect reasoning. Be objective and structured.',
                { ...modelConfig, temperature: 0.2 }
            ),
            new CouncilAgent(
                'agent-creativity',
                'The Visionary (Creativity)',
                'You are The Visionary. Approach the problem with out-of-the-box thinking, metaphors, and future-oriented possibilities. Be inspiring.',
                { ...modelConfig, temperature: 0.9 }
            ),
            new CouncilAgent(
                'agent-ethics',
                'The Guardian (Ethics)',
                'You are The Guardian. Focus on the ethical implications, human impact, emotional intelligence, and moral responsibility of the answer.',
                modelConfig
            ),
            new CouncilAgent(
                'agent-critic',
                'The Verifier (Critic)',
                'You are The Verifier. Scrutinize facts, check for inconsistencies, and play devil\'s advocate against common assumptions. Be rigorous.',
                { ...modelConfig, temperature: 0.5 }
            )
        ];

        this.debateConfig = {
            provider: 'openrouter',
            model: 'anthropic/claude-3-opus', // High context window and nuance for synthesis
            apiKey: process.env.OPENROUTER_API_KEY,
            temperature: 0.5
        };
    }

    async processQuery(query: string): Promise<SynthesisResult> {
        console.log(`[Council] Convening for query: "${query}"`);

        // 1. Gather Context (RAG)
        const retrievedChunks = await ragService.query(query, 5);
        const contextSummary = retrievedChunks.length > 0
            ? `Retrieved Context:\n${retrievedChunks.join('\n\n')}`
            : "No specific documents found in Knowledge Base.";

        console.log(`[Council] Retrieved ${retrievedChunks.length} chunks of context.`);

        // 2. Parallel Council Deliberation
        const agentPromises = this.agents.map(agent => agent.process(query, contextSummary));
        const responses: CouncilAgentResponse[] = await Promise.all(agentPromises);

        // 3. Synthesis / Consensus
        const consensus = await this.synthesize(query, responses);

        return {
            finalResponse: consensus,
            structure: 'CONSENSUS',
            confidence: 0.95,
            sources: ["Council Knowledge Base"],
            agentTraces: responses
        };
    }

    private async synthesize(query: string, responses: CouncilAgentResponse[]): Promise<string> {
        const debateTranscript = responses.map(r => `
---
SPEAKER: ${r.personaName}
ARGUMENT:
${r.content}
---
`).join('\n');

        const prompt = `
You are the Speaker of the Council. You have heard arguments from four distinct perspectives regarding the user's query.

User Query: "${query}"

Debate Transcript:
${debateTranscript}

Your Task:
1. Synthesize a unified answer that incorporates the best insights from all agents.
2. Resolve any conflicts between Logic and Ethics, or Vision and Criticism.
3. Provide a clear, comprehensive final answer.
4. Conclude with a "Council Verdict" summarizing the main takeaway.
`;

        try {
            return await llmService.generate(this.debateConfig, prompt);
        } catch (error) {
            console.error('[Council] Synthesis failed:', error);
            return "The Council could not reach a consensus due to a communication error.";
        }
    }
}
