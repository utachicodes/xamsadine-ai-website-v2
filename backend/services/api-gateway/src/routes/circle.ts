import { Request, Response } from "express";
import { CircleOrchestrator } from "../../../../orchestrator/circle.ts";

// Singleton instance to keep agents warm if needed
const orchestrator = new CircleOrchestrator();

export async function askCircle(req: Request, res: Response) {
    try {
        const { query } = req.body;

        if (!query || typeof query !== "string") {
            res.status(400).json({ error: "Query is required and must be a string." });
            return;
        }

        console.log(`[CircleRoute] Received query: ${query}`);

        const result = await orchestrator.processQuery(query);

        res.json(result);
    } catch (error: any) {
        console.error(`[CircleRoute] Error processing query:`, error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message || "An error occurred in the Circle of Knowledge."
        });
    }
}
