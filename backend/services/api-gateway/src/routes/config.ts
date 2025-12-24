import { Request, Response } from "express";
import { configService } from "../../../../services/config-service/config.service";

export async function getAgents(req: Request, res: Response) {
    try {
        const agents = await configService.getAllAgents();
        res.json({ agents });
    } catch (error: any) {
        console.error('[ConfigRoute] Error getting agents:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function updateAgent(req: Request, res: Response) {
    try {
        const { agentId } = req.params;
        const updates = req.body;

        await configService.updateAgentConfig(agentId, updates);
        const updated = await configService.getAgentConfig(agentId);

        res.json({ agent: updated });
    } catch (error: any) {
        console.error('[ConfigRoute] Error updating agent:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getModels(req: Request, res: Response) {
    try {
        const models = configService.getAvailableModels();
        res.json({ models });
    } catch (error: any) {
        console.error('[ConfigRoute] Error getting models:', error);
        res.status(500).json({ error: error.message });
    }
}
