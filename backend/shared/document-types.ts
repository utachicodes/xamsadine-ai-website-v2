export interface DocumentMetadata {
    id: string;
    filename: string;
    category: string; // e.g., "fiqh-hanafi", "aqeedah-ashari", "context-modern"
    uploadedAt: string;
    processedAt?: string;
    status: 'uploaded' | 'processing' | 'ready' | 'error';
    chunkCount?: number;
}

export interface DocumentChunk {
    id: string;
    documentId: string;
    content: string;
    embedding?: number[];
    metadata: {
        category: string;
        page?: number;
        section?: string;
    };
}
