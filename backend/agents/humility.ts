import { HumilityResponse, AqeedahResponse, FiqhResponse, ContextResponse } from '../shared/types';

export class HumilityAgent {
    async process(
        query: string,
        fiqhResult?: FiqhResponse,
        contextResult?: ContextResponse
    ): Promise<HumilityResponse> {

        let shouldAbstain = false;
        let reason: string | undefined = undefined;
        const confidenceThreshold = 0.5;

        // Check if Fiqh agent was low confidence
        if (fiqhResult && fiqhResult.confidence < confidenceThreshold) {
            shouldAbstain = true;
            reason = "Scholarship consensus is unclear or sources are insufficient (Low Fiqh Confidence).";
        }

        // Check for high ambiguity in query without context
        if (query.split(" ").length < 3) {
            shouldAbstain = true;
            reason = "Query is too vague to provide a responsible ruling.";
        }

        return {
            agentId: "agent-humility-v1",
            agentType: "HUMILITY",
            timestamp: new Date().toISOString(),
            confidence: 1.0,
            trace: [
                `Evaluating reasoning process for gaps`,
                `Fiqh Confidence: ${fiqhResult?.confidence ?? "N/A"}`,
                `Abstention Decision: ${shouldAbstain ? "YES" : "NO"}`
            ],
            shouldAbstain,
            abstentionReason: reason
        };
    }
}
