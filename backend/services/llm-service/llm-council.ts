import { openRouterClient, COUNCIL_MODELS } from './openrouter-client';
import { ragService } from '../rag-service/rag.service';
import { logger } from '../../shared/logger';

export interface CouncilMember {
    id: string;
    name: string;
    role: string;
    modelId: string;
    systemPrompt: string;
    temperature: number;
}

export interface MemberResponse {
    memberId: string;
    memberName: string;
    response: string;
    reasoning: string;
    confidence: number;
}

export interface PeerReview {
    reviewerId: string;
    targetMemberId: string;
    evaluation: string;
    strengthsAndWeaknesses: string;
    score: number;
}

export interface ConsensusResult {
    query: string;
    councilMembers: CouncilMember[];
    initialResponses: MemberResponse[];
    peerReviews: PeerReview[];
    synthesisResult: string;
    consensusScore: number;
    executionTime: number;
}

export class LLMCouncil {
    private members: CouncilMember[];

    constructor() {
        // Initialize 4 diverse council members with different perspectives
        this.members = [
            {
                id: 'member-logic',
                name: 'The Analyst',
                role: 'Logic & Data Expert',
                modelId: COUNCIL_MODELS['gpt-4o'].id, // Fast, precise reasoning
                systemPrompt: `You are The Analyst, a logic and data expert. Your role in the Council is to:
1. Analyze queries using pure logic, structured reasoning, and empirical data
2. Break down complex problems into components
3. Identify patterns and relationships
4. Provide evidence-based conclusions
5. Keep responses concise and data-driven
When reviewing peers, focus on logical consistency and evidence quality.`,
                temperature: 0.2
            },
            {
                id: 'member-creativity',
                name: 'The Visionary',
                role: 'Creative & Innovation Expert',
                modelId: COUNCIL_MODELS['claude-opus'].id, // Nuanced, creative thinking
                systemPrompt: `You are The Visionary, a creative and innovation expert. Your role in the Council is to:
1. Approach problems with lateral thinking and out-of-the-box creativity
2. Suggest novel solutions and future possibilities
3. Use metaphors and analogies to illuminate concepts
4. Identify unconventional approaches others may miss
5. Balance innovation with feasibility
When reviewing peers, assess the originality and potential impact of ideas.`,
                temperature: 0.8
            },
            {
                id: 'member-ethics',
                name: 'The Guardian',
                role: 'Ethics & Wellbeing Expert',
                systemPrompt: `You are The Guardian, an ethics and wellbeing expert. Your role in the Council is to:
1. Evaluate the ethical implications of solutions
2. Consider impact on human wellbeing and dignity
3. Identify potential harms and unintended consequences
4. Advocate for fairness and inclusion
5. Assess alignment with values and principles
When reviewing peers, evaluate ethical considerations and societal impact.`,
                modelId: COUNCIL_MODELS['mistral-large'].id,
                temperature: 0.6
            },
            {
                id: 'member-critic',
                name: 'The Verifier',
                role: 'Critical Analysis Expert',
                systemPrompt: `You are The Verifier, a critical analysis expert. Your role in the Council is to:
1. Scrutinize all claims and assumptions
2. Play devil's advocate to test ideas
3. Identify logical fallacies and weaknesses
4. Challenge consensus when warranted
5. Ensure quality and rigor
When reviewing peers, provide constructive criticism and identify improvement opportunities.`,
                modelId: COUNCIL_MODELS['llama-3-70b'].id,
                temperature: 0.5
            }
        ];
    }

    /**
     * Process a query through the LLM Council
     */
    async processQuery(query: string, ragContext?: string): Promise<ConsensusResult> {
        const startTime = Date.now();
        const councilLogger = logger.prefixed('LLMCouncil');
        councilLogger.info(`Processing query: "${query}"`);

        // Step 1: Retrieve relevant documents from RAG if available
        let contextText = '';
        if (ragContext) {
            contextText = `\n\nRelevant context from knowledge base:\n${ragContext}`;
        }

        const fullPrompt = `${query}${contextText}`;

        // Step 2: Get initial responses from all council members
        councilLogger.info('Gathering initial responses from council members...');
        const initialResponses = await Promise.all(
            this.members.map(member => this.getMemberResponse(member, fullPrompt))
        );

        // Step 3: Conduct peer reviews
        councilLogger.info('Conducting peer reviews...');
        const peerReviews = await this.conductPeerReviews(initialResponses, query);

        // Step 4: Synthesize consensus
        councilLogger.info('Synthesizing consensus...');
        const synthesisResult = await this.synthesizeConsensus(initialResponses, peerReviews, query);

        // Step 5: Calculate consensus score
        const consensusScore = this.calculateConsensusScore(initialResponses, peerReviews);

        const executionTime = Date.now() - startTime;

        return {
            query,
            councilMembers: this.members,
            initialResponses,
            peerReviews,
            synthesisResult,
            consensusScore,
            executionTime
        };
    }

    /**
     * Get response from a single council member
     */
    private async getMemberResponse(member: CouncilMember, prompt: string): Promise<MemberResponse> {
        try {
            console.log(`[Council] ${member.name} is analyzing...`);

            const messages = [
                {
                    role: 'system' as const,
                    content: member.systemPrompt
                },
                {
                    role: 'user' as const,
                    content: prompt
                }
            ];

            const response = await openRouterClient.generateCompletion(
                member.modelId,
                messages,
                {
                    temperature: member.temperature,
                    maxTokens: 1500
                }
            );

            // Extract confidence and reasoning from response
            const confidence = this.extractConfidence(response);
            const reasoning = this.extractReasoning(response);

            return {
                memberId: member.id,
                memberName: member.name,
                response,
                reasoning,
                confidence
            };
        } catch (error: any) {
            console.error(`[Council] ${member.name} failed to respond:`, error.message);
            return {
                memberId: member.id,
                memberName: member.name,
                response: `Error: ${error.message}`,
                reasoning: 'Unable to process',
                confidence: 0
            };
        }
    }

    /**
     * Conduct peer reviews of all responses
     */
    private async conductPeerReviews(responses: MemberResponse[], query: string): Promise<PeerReview[]> {
        const reviews: PeerReview[] = [];

        for (const reviewer of this.members) {
            for (const targetResponse of responses) {
                if (reviewer.id === targetResponse.memberId) continue;

                try {
                    const reviewPrompt = `Original Query: "${query}"

${targetResponse.memberName}'s Response:
${targetResponse.response}

As ${reviewer.name}, evaluate this response:
1. Identify strengths and weaknesses
2. Rate the quality on a scale of 1-10
3. Provide constructive feedback

Format your response as:
EVALUATION: [brief evaluation]
STRENGTHS: [strengths]
WEAKNESSES: [weaknesses]
SCORE: [1-10]`;

                    const messages = [
                        {
                            role: 'system' as const,
                            content: reviewer.systemPrompt
                        },
                        {
                            role: 'user' as const,
                            content: reviewPrompt
                        }
                    ];

                    const reviewText = await openRouterClient.generateCompletion(
                        reviewer.modelId,
                        messages,
                        {
                            temperature: 0.5,
                            maxTokens: 800
                        }
                    );

                    const score = this.extractScore(reviewText);

                    reviews.push({
                        reviewerId: reviewer.id,
                        targetMemberId: targetResponse.memberId,
                        evaluation: reviewText,
                        strengthsAndWeaknesses: this.extractStrengthsWeaknesses(reviewText),
                        score
                    });
                } catch (error: any) {
                    console.error(`[Council] Review by ${reviewer.name} failed:`, error.message);
                }
            }
        }

        return reviews;
    }

    /**
     * Synthesize consensus from all responses and reviews
     */
    private async synthesizeConsensus(
        responses: MemberResponse[],
        reviews: PeerReview[],
        query: string
    ): Promise<string> {
        const responsesSummary = responses
            .map(r => `${r.memberName}: ${r.response.substring(0, 500)}...`)
            .join('\n\n');

        const topReviews = reviews
            .sort((a, b) => b.score - a.score)
            .slice(0, 8)
            .map(r => `${r.evaluation}`)
            .join('\n');

        const synthesisPrompt = `Original Query: "${query}"

Council Responses Summary:
${responsesSummary}

Key Reviews and Evaluations:
${topReviews}

As the Synthesis Expert, synthesize these perspectives into a comprehensive, balanced answer that:
1. Incorporates insights from all council members
2. Acknowledges different perspectives
3. Provides a clear, actionable conclusion
4. Explains the reasoning process
5. Highlights any areas of agreement or disagreement

Provide a coherent, well-structured response that represents the consensus of the council.`;

        const messages = [
            {
                role: 'system' as const,
                content: `You are a synthesis expert who combines diverse viewpoints into coherent conclusions. 
Your role is to:
1. Respect all perspectives while finding common ground
2. Highlight areas of consensus
3. Acknowledge legitimate disagreements
4. Provide actionable recommendations
5. Maintain intellectual honesty and nuance`
            },
            {
                role: 'user' as const,
                content: synthesisPrompt
            }
        ];

        try {
            const synthesis = await openRouterClient.generateCompletion(
                COUNCIL_MODELS['claude-opus'].id,
                messages,
                {
                    temperature: 0.7,
                    maxTokens: 2000
                }
            );

            return synthesis;
        } catch (error: any) {
            console.error('[Council] Synthesis failed:', error.message);
            return 'Unable to synthesize consensus. Please try again.';
        }
    }

    /**
     * Calculate overall consensus score
     */
    private calculateConsensusScore(
        responses: MemberResponse[],
        reviews: PeerReview[]
    ): number {
        if (responses.length === 0 || reviews.length === 0) return 0;

        const avgResponseConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;

        const avgReviewScore = reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;

        // Calculate variance in review scores (lower variance = higher consensus)
        const meanScore = avgReviewScore;
        const variance =
            reviews.reduce((sum, r) => sum + Math.pow(r.score - meanScore, 2), 0) / reviews.length;
        const stdDev = Math.sqrt(variance);
        const consensusFromVariance = Math.max(0, 1 - stdDev / 5); // Normalize to 0-1

        // Weighted average
        return avgResponseConfidence * 0.3 + avgReviewScore / 10 * 0.4 + consensusFromVariance * 0.3;
    }

    // Helper methods for parsing responses

    private extractConfidence(response: string): number {
        const confidenceMatch = response.match(/confidence[:\s]+(\d+(?:\.\d+)?)\s*%/i);
        if (confidenceMatch) {
            return Math.min(100, Math.max(0, parseFloat(confidenceMatch[1]))) / 100;
        }
        // Default to 0.7 if not specified
        return 0.7;
    }

    private extractReasoning(response: string): string {
        const reasoningMatch = response.match(/reasoning[:\s]+(.*?)(?=\n\n|$)/is);
        if (reasoningMatch) {
            return reasoningMatch[1].trim().substring(0, 200);
        }
        return response.substring(0, 200);
    }

    private extractScore(reviewText: string): number {
        const scoreMatch = reviewText.match(/score[:\s]+(\d+)\s*\/\s*10/i);
        if (scoreMatch) {
            return parseInt(scoreMatch[1], 10);
        }
        return 5; // Default to neutral
    }

    private extractStrengthsWeaknesses(reviewText: string): string {
        const strengthsMatch = reviewText.match(/strengths[:\s]+(.*?)(?=weaknesses|$)/is);
        const weaknessesMatch = reviewText.match(/weaknesses[:\s]+(.*?)(?=\n|$)/is);

        const strengths = strengthsMatch ? strengthsMatch[1].trim().substring(0, 150) : '';
        const weaknesses = weaknessesMatch ? weaknessesMatch[1].trim().substring(0, 150) : '';

        return `Strengths: ${strengths}\nWeaknesses: ${weaknesses}`;
    }

    getMembers(): CouncilMember[] {
        return this.members;
    }
}

export const llmCouncil = new LLMCouncil();
