import { ContextResponse } from '../shared/types';

export class ContextAgent {
    async process(query: string): Promise<ContextResponse> {
        const lowerQuery = query.toLowerCase();
        const tags: string[] = [];
        const implications: string[] = [];

        if (lowerQuery.includes("crypto") || lowerQuery.includes("bitcoin")) {
            tags.push("Digital Assets");
            tags.push("Finance");
            implications.push("Requires analysis of 'Mal' (property) status in digital form.");
        }

        if (lowerQuery.includes("bank") || lowerQuery.includes("interest") || lowerQuery.includes("loan")) {
            tags.push("Modern Banking");
            tags.push("Finance");
            implications.push("Consider distinguishing between predatory usury and modern institutional interest (though majority consensus remains prohibitive).");
        }

        if (lowerQuery.includes("ai") || lowerQuery.includes("artificial intelligence")) {
            tags.push("Technology");
            tags.push("Ethics");
        }

        return {
            agentId: "agent-context-v1",
            agentType: "CONTEXT",
            timestamp: new Date().toISOString(),
            confidence: 0.85,
            trace: [
                `Scanned query for modern context indicators`,
                `Tags identified: ${tags.join(", ")}`
            ],
            tags,
            modernImplications: implications
        };
    }
}
