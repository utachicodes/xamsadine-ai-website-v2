import { Request, Response } from "express";
import { CouncilOrchestrator } from "../../../../orchestrator/council";

const orchestrator = new CouncilOrchestrator();

export async function askCouncil(req: Request, res: Response) {
    try {
        const { query } = req.body;

        if (!query || typeof query !== "string") {
            res.status(400).json({ error: "Query is required and must be a string." });
            return;
        }

        console.log(`[CouncilRoute] Received query: ${query}`);

        const result = await orchestrator.processQuery(query);

        res.json(result);
    } catch (error: any) {
        console.error(`[CouncilRoute] Error processing query:`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message || "The Council is currently in recess."
        });
    }
}
