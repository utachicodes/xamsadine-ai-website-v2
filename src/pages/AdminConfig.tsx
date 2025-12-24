import * as React from "react";
import { Settings, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

interface AgentConfig {
    agentId: string;
    agentName: string;
    llmConfig: {
        provider: 'openai' | 'anthropic' | 'local';
        model: string;
        apiKey?: string;
        endpoint?: string;
        temperature?: number;
        maxTokens?: number;
    };
    enabled: boolean;
}

interface AvailableModel {
    provider: string;
    models: string[];
}

const AdminConfig: React.FC = () => {
    const [agents, setAgents] = React.useState<Record<string, AgentConfig>>({});
    const [availableModels, setAvailableModels] = React.useState<AvailableModel[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        try {
            const [agentsRes, modelsRes] = await Promise.all([
                apiFetch('/api/config/agents'),
                apiFetch('/api/config/models')
            ]);

            if (agentsRes.ok && modelsRes.ok) {
                const agentsData = await agentsRes.json();
                const modelsData = await modelsRes.json();
                setAgents(agentsData.agents || {});
                setAvailableModels(modelsData.models || []);
            }
        } catch (error) {
            toast({
                title: "Connection Error",
                description: "Could not load configuration. Ensure backend is running.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const updateAgent = async (agentId: string, updates: Partial<AgentConfig>) => {
        setSaving(true);
        try {
            const response = await apiFetch(`/api/config/agents/${agentId}`, {
                method: 'POST',
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                const { agent } = await response.json();
                setAgents(prev => ({ ...prev, [agentId]: agent }));
                toast({
                    title: "Saved!",
                    description: `${agent.agentName} configuration updated.`
                });
            }
        } catch (error) {
            toast({
                title: "Save Failed",
                description: "Could not save configuration.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const updateLLMField = (agentId: string, field: string, value: any) => {
        setAgents(prev => ({
            ...prev,
            [agentId]: {
                ...prev[agentId],
                llmConfig: {
                    ...prev[agentId].llmConfig,
                    [field]: value
                }
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex-1 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-islamic-green animate-spin mx-auto mb-4" />
                    <p className="text-islamic-dark/70">Loading configuration...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-white to-islamic-gold/10">
            <section className="container py-10 md:py-16">
                <header className="mb-12">
                    <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                        Admin Panel
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-4">
                        <span className="text-gradient">Model Configuration</span>
                    </h1>
                    <p className="text-islamic-dark/70 max-w-2xl leading-relaxed">
                        Assign LLMs to each epistemic agent and configure their parameters.
                    </p>
                </header>

                <div className="max-w-5xl mx-auto space-y-6">
                    {Object.entries(agents).map(([agentId, agent]) => (
                        <div key={agentId} className="islamic-card p-6 bg-white/95">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-islamic-green/10 flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-islamic-green" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-islamic-dark">{agent.agentName}</h3>
                                        <p className="text-xs text-islamic-dark/60">Agent ID: {agentId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => updateAgent(agentId, agent)}
                                    disabled={saving}
                                    className="btn-islamic-outlined flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-islamic-dark mb-2">
                                        Provider
                                    </label>
                                    <select
                                        value={agent.llmConfig.provider}
                                        onChange={(e) => updateLLMField(agentId, 'provider', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-islamic-cream bg-white text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
                                    >
                                        {availableModels.map((p) => (
                                            <option key={p.provider} value={p.provider}>
                                                {p.provider.charAt(0).toUpperCase() + p.provider.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-islamic-dark mb-2">
                                        Model
                                    </label>
                                    <select
                                        value={agent.llmConfig.model}
                                        onChange={(e) => updateLLMField(agentId, 'model', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-islamic-cream bg-white text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
                                    >
                                        {availableModels
                                            .find(p => p.provider === agent.llmConfig.provider)
                                            ?.models.map((model) => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-islamic-dark mb-2">
                                        Temperature
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="2"
                                        value={agent.llmConfig.temperature}
                                        onChange={(e) => updateLLMField(agentId, 'temperature', parseFloat(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-islamic-cream bg-white text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-islamic-dark mb-2">
                                        Max Tokens
                                    </label>
                                    <input
                                        type="number"
                                        step="100"
                                        value={agent.llmConfig.maxTokens}
                                        onChange={(e) => updateLLMField(agentId, 'maxTokens', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-islamic-cream bg-white text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-islamic-dark mb-2">
                                        API Key {agent.llmConfig.provider !== 'local' && '(Required)'}
                                    </label>
                                    <input
                                        type="password"
                                        placeholder={`Enter ${agent.llmConfig.provider} API key`}
                                        value={agent.llmConfig.apiKey || ''}
                                        onChange={(e) => updateLLMField(agentId, 'apiKey', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-islamic-cream bg-white text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminConfig;
