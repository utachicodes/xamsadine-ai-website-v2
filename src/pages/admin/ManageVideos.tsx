import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, Plus, Edit, Trash2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_VIDEOS } from '@/lib/mock-data';
import { MediaContent } from '@/types/ecosystem';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function ManageVideos() {
    const { t } = useLanguage();
    const [videos, setVideos] = useState<MediaContent[]>(MOCK_VIDEOS);
    const [isCreating, setIsCreating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
        thumbnail_url: '',
        duration_seconds: '',
        language: 'fr',
        audience: 'adults' as 'kids' | 'teens' | 'adults',
        transcript: '',
    });

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        // Simulate AI video generation
        setTimeout(() => {
            const generatedVideo: MediaContent = {
                id: `video-ai-${Date.now()}`,
                title: `AI Generated Video - ${new Date().toLocaleDateString()}`,
                description: 'This video was generated using AI technology based on Islamic content guidelines.',
                type: 'video',
                url: 'https://example.com/ai-video.mp4',
                thumbnail_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
                duration_seconds: 1200,
                language: 'fr',
                audience: 'adults',
                transcript: 'AI generated transcript...',
                published_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            };
            setVideos([generatedVideo, ...videos]);
            setIsGenerating(false);
            toast.success('AI video generated successfully!');
        }, 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setVideos(videos.map(v => 
                v.id === editingId 
                    ? { 
                        ...v, 
                        ...formData, 
                        duration_seconds: parseInt(formData.duration_seconds) || undefined,
                        published_at: v.published_at,
                        created_at: v.created_at,
                    }
                    : v
            ));
            toast.success('Video updated successfully');
            setEditingId(null);
        } else {
            const newVideo: MediaContent = {
                id: `video-${Date.now()}`,
                ...formData,
                type: 'video',
                duration_seconds: parseInt(formData.duration_seconds) || undefined,
                published_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            };
            setVideos([newVideo, ...videos]);
            toast.success('Video created successfully');
            setIsCreating(false);
        }
        setFormData({
            title: '',
            description: '',
            url: '',
            thumbnail_url: '',
            duration_seconds: '',
            language: 'fr',
            audience: 'adults',
            transcript: '',
        });
    };

    const handleEdit = (video: MediaContent) => {
        setEditingId(video.id);
        setFormData({
            title: video.title,
            description: video.description,
            url: video.url,
            thumbnail_url: video.thumbnail_url || '',
            duration_seconds: video.duration_seconds?.toString() || '',
            language: video.language,
            audience: video.audience,
            transcript: video.transcript || '',
        });
        setIsCreating(true);
    };

    const handleDelete = (id: string) => {
        setVideos(videos.filter(v => v.id !== id));
        toast.success('Video deleted successfully');
    };

    return (
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-10">
                <header className="flex justify-between items-center">
                    <div>
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                            Admin
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
                            Manage <span className="text-gradient">Videos</span>
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            {isGenerating ? 'Generating...' : 'Generate AI Video'}
                        </Button>
                        <Button 
                            onClick={() => {
                                setIsCreating(true);
                                setEditingId(null);
                                setFormData({
                                    title: '',
                                    description: '',
                                    url: '',
                                    thumbnail_url: '',
                                    duration_seconds: '',
                                    language: 'fr',
                                    audience: 'adults',
                                    transcript: '',
                                });
                            }}
                            className="btn-islamic"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Video
                        </Button>
                    </div>
                </header>

                {isCreating && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit Video' : 'Upload New Video'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Video Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    rows={4}
                                    required
                                />
                                <Input
                                    placeholder="Video URL"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Thumbnail URL"
                                    value={formData.thumbnail_url}
                                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                />
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Duration (seconds)</label>
                                        <Input
                                            type="number"
                                            value={formData.duration_seconds}
                                            onChange={(e) => setFormData({ ...formData, duration_seconds: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Language</label>
                                        <select
                                            value={formData.language}
                                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="fr">French</option>
                                            <option value="en">English</option>
                                            <option value="wo">Wolof</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Audience</label>
                                        <select
                                            value={formData.audience}
                                            onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="kids">Kids</option>
                                            <option value="teens">Teens</option>
                                            <option value="adults">Adults</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Transcript (optional)"
                                    value={formData.transcript}
                                    onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    rows={4}
                                />
                                <div className="flex gap-2">
                                    <Button type="submit" className="btn-islamic">
                                        {editingId ? 'Update' : 'Create'}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => {
                                            setIsCreating(false);
                                            setEditingId(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <Card key={video.id} className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30 overflow-hidden">
                            <div className="aspect-video relative bg-islamic-dark/10">
                                {video.thumbnail_url ? (
                                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <PlayCircle size={48} className="text-islamic-dark/40" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-islamic-dark line-clamp-2">{video.title}</h3>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(video)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(video.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-islamic-dark/70 line-clamp-2 mb-3">{video.description}</p>
                                <div className="flex gap-2">
                                    <Badge>{video.language}</Badge>
                                    <Badge variant="outline">{video.audience}</Badge>
                                    <Badge variant="outline">{Math.floor((video.duration_seconds || 0) / 60)} min</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}

