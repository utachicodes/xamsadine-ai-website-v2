import {
    SynthesisResult,
    FiqhResponse,
    AqeedahResponse,
    ContextResponse,
    HumilityResponse,
    AnyAgentResponse
} from '../shared/types';

export class SynthesisEngine {
    synthesize(
        fiqh: FiqhResponse,
        aqeedah: AqeedahResponse,
        context: ContextResponse,
        humility: HumilityResponse
    ): SynthesisResult {

        let finalResponse = "";
        let structure: SynthesisResult['structure'] = 'CONSENSUS';
        let confidence = 1.0;

        // 1. Safety Check (Aqeedah)
        if (!aqeedah.isSafe) {
            return {
                finalResponse: `[SAFETY BLOCK] ${aqeedah.note} The system cannot proceed with this query due to theological safety boundaries.`,
                structure: 'BLOCKED',
                confidence: 1.0,
                sources: [],
                agentTraces: [aqeedah, fiqh, context, humility]
            };
        }

        // 2. Humility Check
        if (humility.shouldAbstain) {
            return {
                finalResponse: `[ABSTENTION] The system submits to silence on this matter. Reason: ${humility.abstentionReason}`,
                structure: 'ABSTENTION',
                confidence: 1.0,
                sources: [],
                agentTraces: [aqeedah, fiqh, context, humility]
            };
        }

        // 3. Construct Ruling
        const rulings = fiqh.rulings;
        const madhhabs = Object.keys(rulings);

        if (madhhabs.length === 0) {
            finalResponse = "No specific Fiqh rulings found for this topic.";
            confidence = 0.0;
        } else {
            const rulingTexts = madhhabs.map(m => {
                const r = rulings[m as keyof typeof rulings];
                if (!r) return "";
                return `**${m}**: ${r.hukm} (Evidence: ${r.dalil})`;
            }).filter(Boolean);

            finalResponse = `**Ruling Summary:**\n\n${rulingTexts.join("\n\n")}`;

            if (context.tags.length > 0) {
                finalResponse += `\n\n**Modern Context:**\nSubject tags: ${context.tags.join(", ")}. \n${context.modernImplications.join(" ")}`;
            }

            structure = madhhabs.length > 1 ? 'IKHTILAF' : 'CONSENSUS';
        }

        return {
            finalResponse,
            structure,
            confidence,
            sources: ["System Knowledge Base"], // Placeholder
            agentTraces: [aqeedah, fiqh, context, humility]
        };
    }
}
