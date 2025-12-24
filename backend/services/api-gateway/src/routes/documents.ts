import { Request, Response } from "express";
import { documentManager } from "../../../../services/rag-service/document-manager";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadMiddleware = upload.single('file');

export async function uploadDocument(req: Request, res: Response) {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const { category } = req.body;
        if (!category) {
            res.status(400).json({ error: 'Category is required' });
            return;
        }

        const metadata = await documentManager.uploadDocument(
            req.file.originalname,
            req.file.buffer,
            category
        );

        res.json({ document: metadata });
    } catch (error: any) {
        console.error('[DocumentRoute] Upload error:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function listDocuments(req: Request, res: Response) {
    try {
        const { category } = req.query;
        const documents = await documentManager.listDocuments(category as string);
        res.json({ documents });
    } catch (error: any) {
        console.error('[DocumentRoute] List error:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function deleteDocument(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await documentManager.deleteDocument(id);
        res.json({ success: true });
    } catch (error: any) {
        console.error('[DocumentRoute] Delete error:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getDocumentSignedUrl(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const url = await documentManager.getSignedUrl(id);
        res.json({ url });
    } catch (error: any) {
        console.error('[DocumentRoute] SignedUrl error:', error);
        res.status(500).json({ error: error.message });
    }
}
