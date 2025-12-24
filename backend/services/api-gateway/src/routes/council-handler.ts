import { Request, Response } from 'express';
import { llmCouncil } from '../../../../services/llm-service/llm-council';
import { ragService } from '../../../../services/rag-service/rag.service';
import { logger } from '../../../../shared/logger';
import { Validator } from '../../../../shared/validator';

const routeLogger = logger.prefixed('CouncilRoute');

/**
 * Ask the LLM Council a question
 * POST /api/council/ask
 */
export async function askCouncil(req: Request, res: Response) {
    try {
        const { query, useRAG = true, topK = 5 } = req.body;

        // Validate input
        const validatedQuery = Validator.validateString(query, 'query', {
            required: true,
            minLength: 3,
            maxLength: 5000
        });

        routeLogger.info(`Processing query: "${validatedQuery}"`);

        let ragContext = '';
        if (useRAG) {
            routeLogger.info('Retrieving RAG context...');
            const ragResult = await ragService.search(validatedQuery, topK);
            ragContext = ragResult.context;
            routeLogger.debug(`Found ${ragResult.sources.length} relevant sources`);
        }

        const result = await llmCouncil.processQuery(validatedQuery, ragContext);

        res.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        routeLogger.error('Error processing query', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'Failed to process council query',
            success: false
        });
    }
}

/**
 * Get council member information
 * GET /api/council/members
 */
export function getCouncilMembers(req: Request, res: Response) {
    try {
        const members = llmCouncil.getMembers();
        res.json({
            success: true,
            data: members.map(m => ({
                id: m.id,
                name: m.name,
                role: m.role,
                modelId: m.modelId,
                temperature: m.temperature
            }))
        });
    } catch (error: any) {
        console.error('[CouncilRoute] Error getting members:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            success: false
        });
    }
}

/**
 * Upload and ingest a document for RAG
 * POST /api/council/documents
 */
export async function uploadDocument(req: Request, res: Response) {
    try {
        const { docId, title, content, source, category = 'general' } = req.body;

        // Validate input
        const validatedDocId = Validator.validateString(docId, 'docId', { required: true });
        const validatedTitle = Validator.validateString(title, 'title', { required: true, maxLength: 500 });
        const validatedContent = Validator.validateString(content, 'content', { required: true });
        const validatedSource = Validator.validateString(source, 'source', { required: true });

        routeLogger.info(`Ingesting document: "${validatedTitle}"`);
        await ragService.ingestDocument(validatedDocId, validatedTitle, validatedContent, validatedSource, category);

        res.json({
            success: true,
            message: `Document "${validatedTitle}" ingested successfully`,
            docId: validatedDocId
        });
    } catch (error: any) {
        routeLogger.error('Error uploading document', error);
        res.status(500).json({
            error: 'Failed to upload document',
            message: error.message,
            success: false
        });
    }
}
    } catch (error: any) {
        console.error('[CouncilRoute] Error uploading document:', error);
        res.status(500).json({
            error: 'Failed to upload document',
            message: error.message,
            success: false
        });
    }
}

/**
 * List all ingested documents
 * GET /api/council/documents
 */
export function listDocuments(req: Request, res: Response) {
    try {
        const documents = ragService.getAllDocuments();
        res.json({
            success: true,
            data: documents,
            count: documents.length
        });
    } catch (error: any) {
        console.error('[CouncilRoute] Error listing documents:', error);
        res.status(500).json({
            error: 'Failed to list documents',
            message: error.message,
            success: false
        });
    }
}

/**
 * Get document by ID
 * GET /api/council/documents/:docId
 */
export function getDocument(req: Request, res: Response) {
    try {
        const { docId } = req.params;
        const document = ragService.getDocument(docId);

        if (!document) {
            res.status(404).json({
                error: 'Document not found',
                success: false
            });
            return;
        }

        res.json({
            success: true,
            data: document
        });
    } catch (error: any) {
        routeLogger.error('Error getting document', error);
        res.status(500).json({
            error: 'Failed to get document',
            message: error.message,
            success: false
        });
    }
}

/**
 * Delete a document
 * DELETE /api/council/documents/:docId
 */
export async function deleteDocument(req: Request, res: Response) {
    try {
        const { docId } = req.params;

        // Validate input
        const validatedDocId = Validator.validateString(docId, 'docId', { required: true });

        routeLogger.info(`Deleting document: ${validatedDocId}`);
        await ragService.removeDocument(validatedDocId);

        res.json({
            success: true,
            message: 'Document deleted successfully',
            docId
        });
    } catch (error: any) {
        console.error('[CouncilRoute] Error deleting document:', error);
        res.status(500).json({
            error: 'Failed to delete document',
            message: error.message,
            success: false
        });
    }
}

/**
 * Search RAG database
 * POST /api/council/search
 */
export async function searchRAG(req: Request, res: Response) {
    try {
        const { query, topK = 5 } = req.body;

        // Validate input
        const validatedQuery = Validator.validateString(query, 'query', {
            required: true,
            minLength: 2,
            maxLength: 5000
        });

        routeLogger.info(`Searching RAG: "${validatedQuery}"`);
        const result = await ragService.search(validatedQuery, topK);

        res.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('[CouncilRoute] Error searching RAG:', error);
        res.status(500).json({
            error: 'Search failed',
            message: error.message,
            success: false
        });
    }
}

/**
 * Health check endpoint
 * GET /api/council/health
 */
export function healthCheck(req: Request, res: Response) {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        members: llmCouncil.getMembers().length
    });
}
