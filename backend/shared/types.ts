export type Madhhab = 'Hanafi' | 'Maliki' | 'Shafi' | 'Hanbali';

export interface BaseAgentResponse {
    agentId: string;
    timestamp: string;
    confidence: number; // 0.0 to 1.0
    trace: string[]; // Step-by-step reasoning
}

export interface FiqhRuling {
    madhhab: Madhhab;
    hukm: string; // The ruling (e.g., "Permissible", "Prohibited")
    dalil: string; // Evidence (Quran/Sunnah/Ijma/Qiyas)
    reasoning: string;
}

export interface FiqhResponse extends BaseAgentResponse {
    agentType: 'FIQH';
    rulings: Record<Madhhab, FiqhRuling | null>; // Can return multiple or specific madhhabs
}

export interface AqeedahResponse extends BaseAgentResponse {
    agentType: 'AQEEDAH';
    isSafe: boolean;
    flags: string[]; // e.g., ["Takfir Risk", "Bid'ah accusation"]
    note: string;
}

export interface ContextResponse extends BaseAgentResponse {
    agentType: 'CONTEXT';
    tags: string[];
    modernImplications: string[];
}

export interface HumilityResponse extends BaseAgentResponse {
    agentType: 'HUMILITY';
    shouldAbstain: boolean;
    abstentionReason?: string;
}

export interface CouncilAgentResponse extends BaseAgentResponse {
    agentType: 'COUNCIL_MEMBER';
    personaName: string;
    content: string;
}

export type AnyAgentResponse = FiqhResponse | AqeedahResponse | ContextResponse | HumilityResponse | CouncilAgentResponse;

export interface SynthesisResult {
    finalResponse: string;
    structure: 'CONSENSUS' | 'IKHTILAF' | 'ABSTENTION' | 'BLOCKED';
    confidence: number;
    sources: string[];
    agentTraces: AnyAgentResponse[];
}
