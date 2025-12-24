import { DocumentMetadata } from '../../shared/document-types';
import fs from 'fs/promises';
import path from 'path';
import { ragService } from './rag.service';

const UPLOAD_DIR = path.join(process.cwd(), 'backend', 'uploads');
const METADATA_FILE = path.join(process.cwd(), 'backend', 'documents.json');

// Ensure upload directory exists
async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
}

export class DocumentManager {
    private documents: Record<string, DocumentMetadata> = {};

    async init() {
        await ensureUploadDir();
        try {
            const data = await fs.readFile(METADATA_FILE, 'utf-8');
            this.documents = JSON.parse(data);
        } catch {
            this.documents = {};
        }
        await ragService.init();
    }

    async saveMetadata() {
        await fs.writeFile(METADATA_FILE, JSON.stringify(this.documents, null, 2));
    }

    async uploadDocument(filename: string, content: Buffer, category: string): Promise<DocumentMetadata> {
        const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const filepath = path.join(UPLOAD_DIR, `${id}_${filename}`);

        await fs.writeFile(filepath, content);

        const metadata: DocumentMetadata = {
            id,
            filename,
            category,
            uploadedAt: new Date().toISOString(),
            status: 'uploaded'
        };

        this.documents[id] = metadata;
        await this.saveMetadata();

        // Trigger processing (chunking + embeddings)
        this.processDocument(id).catch(console.error);

        return metadata;
    }

    async processDocument(id: string) {
        const doc = this.documents[id];
        if (!doc) return;

        doc.status = 'processing';
        await this.saveMetadata();

        try {
            // Read file
            const filepath = path.join(UPLOAD_DIR, `${id}_${doc.filename}`);
            const content = await fs.readFile(filepath, 'utf-8');

            // Chunking
            const chunks = this.chunkText(content);
            doc.chunkCount = chunks.length;

            // Generate embeddings and store in vector DB
            await ragService.ingestDocument(id, chunks);

            doc.status = 'ready';
            doc.processedAt = new Date().toISOString();
        } catch (error) {
            console.error('Error processing document:', error);
            doc.status = 'error';
        }

        await this.saveMetadata();
    }

    private chunkText(text: string, maxChunkSize = 500): string[] {
        const paragraphs = text.split(/\n\n+/);
        const chunks: string[] = [];
        let currentChunk = '';

        for (const para of paragraphs) {
            if (currentChunk.length + para.length > maxChunkSize && currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = para;
            } else {
                currentChunk += (currentChunk ? '\n\n' : '') + para;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    async listDocuments(category?: string): Promise<DocumentMetadata[]> {
        const all = Object.values(this.documents);
        return category ? all.filter(d => d.category === category) : all;
    }

    async deleteDocument(id: string): Promise<void> {
        const doc = this.documents[id];
        if (!doc) throw new Error('Document not found');

        const filepath = path.join(UPLOAD_DIR, `${id}_${doc.filename}`);
        try {
            await fs.unlink(filepath);
        } catch {
            // File might not exist
        }

        await ragService.deleteDocument(id);

        delete this.documents[id];
        await this.saveMetadata();
    }
}

export const documentManager = new DocumentManager();
