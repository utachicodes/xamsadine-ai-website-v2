import { FiqhAgent } from '../agents/fiqh';
import { AqeedahAgent } from '../agents/aqeedah';
import { ContextAgent } from '../agents/context';
import { HumilityAgent } from '../agents/humility';
import { SynthesisEngine } from '../synthesis/engine';
import { SynthesisResult } from '../shared/types';

export class CircleOrchestrator {
    private fiqhAgent: FiqhAgent;
    private aqeedahAgent: AqeedahAgent;
    private contextAgent: ContextAgent;
    private humilityAgent: HumilityAgent;
    private synthesisEngine: SynthesisEngine;

    constructor() {
        this.fiqhAgent = new FiqhAgent();
        this.aqeedahAgent = new AqeedahAgent();
        this.contextAgent = new ContextAgent();
        this.humilityAgent = new HumilityAgent();
        this.synthesisEngine = new SynthesisEngine();
    }

    async processQuery(query: string): Promise<SynthesisResult> {
        console.log(`[CircleOrchestrator] Processing query: "${query}"`);

        // 1. Parallel execution of independent agents
        const [fiqhResult, aqeedahResult, contextResult] = await Promise.all([
            this.fiqhAgent.process(query),
            this.aqeedahAgent.process(query),
            this.contextAgent.process(query)
        ]);

        // 2. Humility Agent runs with context of Fiqh confidence
        // In a full system, this might simpler lateral connections, but here it's a distinct stage
        const humilityResult = await this.humilityAgent.process(query, fiqhResult, contextResult);

        // 3. Synthesis
        const result = this.synthesisEngine.synthesize(
            fiqhResult,
            aqeedahResult,
            contextResult,
            humilityResult
        );

        return result;
    }
}
