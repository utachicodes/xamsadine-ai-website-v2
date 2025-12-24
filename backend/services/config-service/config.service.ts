import fs from 'fs/promises';
import path from 'path';
import { SystemConfig, AgentConfig, LLMConfig } from '../../shared/config-types';

const CONFIG_FILE = path.join(process.cwd(), 'backend', 'config.json');

// Default configuration
const DEFAULT_CONFIG: SystemConfig = {
    agents: {
        fiqh: {
            agentId: 'fiqh',
            agentName: 'Fiqh Reasoning Agent',
            llmConfig: {
                provider: 'openai',
                model: 'gpt-4',
                temperature: 0.3,
                maxTokens: 2000
            },
            enabled: true
        },
        aqeedah: {
            agentId: 'aqeedah',
            agentName: 'Aqeedah Boundary Agent',
            llmConfig: {
                provider: 'openai',
                model: 'gpt-3.5-turbo',
                temperature: 0.1,
                maxTokens: 1000
            },
            enabled: true
        },
        context: {
            agentId: 'context',
            agentName: 'Contemporary Context Agent',
            llmConfig: {
                provider: 'openai',
                model: 'gpt-4',
                temperature: 0.5,
                maxTokens: 1500
            },
            enabled: true
        }
    },
    lastUpdated: new Date().toISOString()
};

export class ConfigService {
    private config: SystemConfig | null = null;

    async loadConfig(): Promise<SystemConfig> {
        try {
            const data = await fs.readFile(CONFIG_FILE, 'utf-8');
            this.config = JSON.parse(data);
            return this.config!;
        } catch (error) {
            // If file doesn't exist, create default
            console.log('Config file not found, creating default...');
            await this.saveConfig(DEFAULT_CONFIG);
            this.config = DEFAULT_CONFIG;
            return DEFAULT_CONFIG;
        }
    }

    async saveConfig(config: SystemConfig): Promise<void> {
        config.lastUpdated = new Date().toISOString();
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
        this.config = config;
    }

    async getAgentConfig(agentId: string): Promise<AgentConfig | null> {
        if (!this.config) await this.loadConfig();
        return this.config!.agents[agentId] || null;
    }

    async updateAgentConfig(agentId: string, updates: Partial<AgentConfig>): Promise<void> {
        if (!this.config) await this.loadConfig();

        if (!this.config!.agents[agentId]) {
            throw new Error(`Agent ${agentId} not found`);
        }

        this.config!.agents[agentId] = {
            ...this.config!.agents[agentId],
            ...updates
        };

        await this.saveConfig(this.config!);
    }

    async getAllAgents(): Promise<Record<string, AgentConfig>> {
        if (!this.config) await this.loadConfig();
        return this.config!.agents;
    }

    getAvailableModels(): { provider: string; models: string[] }[] {
        return [
            {
                provider: 'openai',
                models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
            },
            {
                provider: 'anthropic',
                models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
            },
            {
                provider: 'local',
                models: ['llama-3', 'mistral', 'custom']
            }
        ];
    }
}

export const configService = new ConfigService();
