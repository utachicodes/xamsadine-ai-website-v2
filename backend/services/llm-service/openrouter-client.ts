import fetch from 'node-fetch';

export interface OpenRouterRequest {
    model: string;
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    top_k?: number;
}

export interface OpenRouterResponse {
    id: string;
    model: string;
    choices: Array<{
        message: { role: string; content: string };
        finish_reason: string;
        stop_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
    };
}

export interface ModelConfig {
    id: string;
    displayName: string;
    provider: string;
    contextWindow: number;
    costPer1kPrompt: number;
    costPer1kCompletion: number;
}

// Available models on OpenRouter for the Council
export const COUNCIL_MODELS: Record<string, ModelConfig> = {
    'claude-opus': {
        id: 'anthropic/claude-3-opus',
        displayName: 'Claude 3 Opus',
        provider: 'Anthropic',
        contextWindow: 200000,
        costPer1kPrompt: 0.015,
        costPer1kCompletion: 0.075
    },
    'gpt-4o': {
        id: 'openai/gpt-4o',
        displayName: 'GPT-4o',
        provider: 'OpenAI',
        contextWindow: 128000,
        costPer1kPrompt: 0.005,
        costPer1kCompletion: 0.015
    },
    'mistral-large': {
        id: 'mistralai/mistral-large',
        displayName: 'Mistral Large',
        provider: 'Mistral AI',
        contextWindow: 32000,
        costPer1kPrompt: 0.002,
        costPer1kCompletion: 0.006
    },
    'llama-3-70b': {
        id: 'meta-llama/llama-3-70b-instruct',
        displayName: 'Llama 3 70B',
        provider: 'Meta',
        contextWindow: 8000,
        costPer1kPrompt: 0.0008,
        costPer1kCompletion: 0.001
    }
};

export class OpenRouterClient {
    private apiKey: string;
    private baseUrl: string = 'https://openrouter.ai/api/v1';
    private referer: string;
    private title: string;

    constructor(apiKey?: string, referer: string = 'https://xamsadine.ai', title: string = 'XamSaDine AI') {
        this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
        this.referer = referer;
        this.title = title;

        if (!this.apiKey) {
            console.warn('⚠️ OPENROUTER_API_KEY not configured. OpenRouter calls will fail.');
        }
    }

    async generateCompletion(
        modelId: string,
        messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
        options?: { temperature?: number; maxTokens?: number; topP?: number }
    ): Promise<string> {
        const payload: OpenRouterRequest = {
            model: modelId,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2000,
            top_p: options?.topP ?? 1.0
        };

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.referer,
                    'X-Title': this.title
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.text();
                console.error(`[OpenRouter] Error response from ${modelId}:`, error);
                throw new Error(`OpenRouter API error (${response.status}): ${error}`);
            }

            const data = (await response.json()) as OpenRouterResponse;

            const content = data.choices?.[0]?.message?.content;
            if (!content) {
                throw new Error(`No content in response from ${modelId}`);
            }

            return content;
        } catch (error: any) {
            console.error(`[OpenRouter] Call to ${modelId} failed:`, error.message);
            throw error;
        }
    }

    async generateWithStreaming(
        modelId: string,
        messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
        onChunk: (chunk: string) => void,
        options?: { temperature?: number; maxTokens?: number }
    ): Promise<string> {
        const payload = {
            model: modelId,
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2000,
            stream: true
        };

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.referer,
                    'X-Title': this.title
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`OpenRouter API error: ${error}`);
            }

            let fullContent = '';
            // For Node.js, stream the response
            if (response.body) {
                const reader = response.body as any;
                for await (const chunk of reader) {
                    const text = chunk.toString();
                    const lines = text.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const jsonStr = line.substring(6);
                            if (jsonStr === '[DONE]') continue;

                            try {
                                const parsed = JSON.parse(jsonStr);
                                const content = parsed.choices?.[0]?.delta?.content || '';
                                if (content) {
                                    fullContent += content;
                                    onChunk(content);
                                }
                            } catch (e) {
                                // Skip parsing errors for stream messages
                            }
                        }
                    }
                }
            }

            return fullContent;
        } catch (error: any) {
            console.error(`[OpenRouter] Streaming call to ${modelId} failed:`, error.message);
            throw error;
        }
    }

    async getEmbedding(text: string): Promise<number[]> {
        try {
            const response = await fetch(`${this.baseUrl}/embeddings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.referer,
                    'X-Title': this.title
                },
                body: JSON.stringify({
                    model: 'openai/text-embedding-3-small',
                    input: text
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Embedding API error: ${error}`);
            }

            const data = (await response.json()) as any;
            return data.data[0]?.embedding || [];
        } catch (error: any) {
            console.error(`[OpenRouter] Embedding generation failed:`, error.message);
            throw error;
        }
    }

    async getAvailableModels(): Promise<typeof COUNCIL_MODELS> {
        return COUNCIL_MODELS;
    }

    isConfigured(): boolean {
        return !!this.apiKey;
    }
}

export const openRouterClient = new OpenRouterClient();
