export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'local' | 'openrouter';
    model: string;
    apiKey?: string;
    endpoint?: string; // For local models
    temperature?: number;
    maxTokens?: number;
}

export interface AgentConfig {
    agentId: string;
    agentName: string;
    llmConfig: LLMConfig;
    enabled: boolean;
}

export interface SystemConfig {
    agents: Record<string, AgentConfig>;
    lastUpdated: string;
}
