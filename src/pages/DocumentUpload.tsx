import * as React from "react";
import { Upload, FileText, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

interface DocumentMetadata {
    id: string;
    filename: string;
    category: string;
    uploadedAt: string;
    status: 'uploaded' | 'processing' | 'ready' | 'error';
    chunkCount?: number;
}

const CATEGORIES = [
    { value: 'fiqh-hanafi', label: 'Fiqh - Hanafi' },
    { value: 'fiqh-maliki', label: 'Fiqh - Maliki' },
    { value: 'fiqh-shafi', label: 'Fiqh - Shafi\'i' },
    { value: 'fiqh-hanbali', label: 'Fiqh - Hanbali' },
    { value: 'aqeedah-ashari', label: 'Aqeedah - Ash\'ari' },
    { value: 'aqeedah-maturidi', label: 'Aqeedah - Maturidi' },
    { value: 'aqeedah-athari', label: 'Aqeedah - Athari' },
    { value: 'context-modern', label: 'Context - Modern Topics' }
];

const DocumentUpload: React.FC = () => {
    const [documents, setDocuments] = React.useState<DocumentMetadata[]>([]);
    const [uploading, setUploading] = React.useState(false);
    const [openingId, setOpeningId] = React.useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = React.useState(CATEGORIES[0].value);
    const [dragActive, setDragActive] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    React.useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const response = await apiFetch('/api/documents');
            if (response.ok) {
                const { documents } = await response.json();
                setDocuments(documents || []);
            }
        } catch (error) {
            console.error('Error loading documents:', error);
        }
    };

    const handleOpen = async (id: string) => {
        setOpeningId(id);
        try {
            const response = await apiFetch(`/api/documents/${id}/url`);
            if (!response.ok) {
                throw new Error('Could not create signed URL');
            }
            const { url } = await response.json();
            if (!url) {
                throw new Error('Missing signed URL');
            }
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            toast({
                title: 'Open Failed',
                description: 'Could not open document. Make sure SUPABASE_SERVICE_ROLE_KEY is set and the file exists in Storage.',
                variant: 'destructive'
            });
        } finally {
            setOpeningId(null);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file.name.match(/\.(txt|pdf|docx|md)$/i)) {
            toast({
                title: "Invalid File Type",
                description: "Please upload a TXT, PDF, DOCX, or MD file.",
                variant: "destructive"
            });
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', selectedCategory);

            const response = await apiFetch('/api/documents/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                toast({
                    title: "Upload Success",
                    description: `${file.name} uploaded successfully!`
                });
                loadDocuments();
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: "Could not upload document. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await apiFetch(`/api/documents/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast({
                    title: "Deleted",
                    description: "Document removed successfully."
                });
                loadDocuments();
            }
        } catch (error) {
            toast({
                title: "Delete Failed",
                description: "Could not delete document.",
                variant: "destructive"
            });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ready':
                return <CheckCircle className="w-4 h-4 text-islamic-green" />;
            case 'processing':
            case 'uploaded':
                return <Loader2 className="w-4 h-4 text-islamic-gold animate-spin" />;
            case 'error':
                return <span className="text-red-500">❌</span>;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-islamic-cream/30 via-white to-islamic-gold/10">
            <section className="container py-10 md:py-16">
                <header className="mb-12">
                    <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                        RAG Knowledge Base
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-islamic-dark mb-4">
                        <span className="text-gradient">Document Upload</span>
                    </h1>
                    <p className="text-islamic-dark/70 max-w-2xl leading-relaxed">
                        Upload documents to train the epistemic agents. Each document is processed and indexed for retrieval.
                    </p>
                </header>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Upload Area */}
                    <div className="islamic-card p-8 bg-white/95">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-islamic-dark mb-3">
                                Select Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-islamic-cream bg-white text-islamic-dark focus:ring-2 focus:ring-islamic-gold/40"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${dragActive
                                    ? 'border-islamic-gold bg-islamic-gold/10'
                                    : 'border-islamic-cream hover:border-islamic-gold/50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileSelect}
                                accept=".txt,.pdf,.docx,.md"
                                className="hidden"
                            />

                            <Upload className="w-12 h-12 text-islamic-gold mx-auto mb-4" />
                            <p className="text-lg font-semibold text-islamic-dark mb-2">
                                Drag and drop your document here
                            </p>
                            <p className="text-sm text-islamic-dark/60 mb-4">
                                or click to browse (PDF, TXT, DOCX, MD)
                            </p>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="btn-islamic disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Select File'}
                            </button>
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="islamic-card p-6 bg-white/95">
                        <h3 className="text-xl font-bold text-islamic-dark mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Uploaded Documents
                        </h3>

                        {documents.length === 0 ? (
                            <p className="text-sm text-islamic-dark/60 text-center py-8">
                                No documents uploaded yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border border-islamic-cream hover:bg-islamic-cream/30 transition-colors">
                                        <div className="flex items-center gap-3 flex-1">
                                            {getStatusIcon(doc.status)}
                                            <div className="flex-1">
                                                <p className="font-medium text-islamic-dark">{doc.filename}</p>
                                                <p className="text-xs text-islamic-dark/60">
                                                    {CATEGORIES.find(c => c.value === doc.category)?.label} •
                                                    {doc.chunkCount ? ` ${doc.chunkCount} chunks` : ` ${doc.status}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpen(doc.id)}
                                                disabled={openingId === doc.id}
                                                className="px-3 py-2 text-xs rounded-lg border border-islamic-cream text-islamic-dark/80 hover:text-islamic-dark hover:border-islamic-gold/50 transition-colors disabled:opacity-50"
                                                title="Preview / Download"
                                            >
                                                {openingId === doc.id ? 'Opening...' : 'Open'}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-2 text-islamic-dark/40 hover:text-red-500 rounded-lg transition-colors"
                                                title="Delete document"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DocumentUpload;
