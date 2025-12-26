
export interface OllamaConfig {
    baseUrl: string;
    model: string;
}

export class OllamaClient {
    private config: OllamaConfig;

    constructor(config: OllamaConfig) {
        this.config = config;
    }

    async isIslamicQuestion(query: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.config.model,
                    prompt: `Is this question related to Islam? Question: "${query}". Answer YES or NO only.`,
                    stream: false
                })
            });
            if (!response.ok) return true; // Default to allowing if check fails
            const data = await response.json();
            return (data.response || '').toUpperCase().includes("YES");
        } catch (e) {
            console.warn("Ollama check failed, defaulting to TRUE", e);
            return true; // Fallback to allowed
        }
    }

    async generateGuidedFatwa(session: any, contextTexts: string[], madhab: string): Promise<string> {
        const prompt = `System: You are an Islamic scholar from the ${madhab} madhab.
    Context: ${contextTexts.join('\n')}
    Question: ${session.question}
    Provide a fatwa structure with HUKM, EVIDENCE, EXPLANATION, and ADVICE.`;

        const response = await fetch(`${this.config.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.config.model,
                prompt: prompt,
                stream: false
            })
        });

        if (!response.ok) throw new Error(`Ollama API failed: ${response.statusText}`);
        const data = await response.json();
        return data.response;
    }
}
