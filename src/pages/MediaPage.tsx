import React, { useEffect, useState } from 'react';
import { EcosystemService } from '@/services/ecosystem';
import { MediaContent } from '@/types/ecosystem';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function MediaPage() {
    const [videos, setVideos] = useState<MediaContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        loadVideos();
    }, [activeTab]);

    const loadVideos = async () => {
        setLoading(true);
        try {
            const audience = activeTab === 'all' ? undefined : activeTab;
            const data = await EcosystemService.getVideos(audience);
            setVideos(data);
        } catch (error) {
            toast.error("Failed to load videos");
        } finally {
            setLoading(false);
        }
    };

    const handleWatch = (video: MediaContent) => {
        toast.info(`Starting video: ${video.title}`);
        // In a real app, this would open a video player modal or navigate to /watch/:id
        // For MVP, we'll simulate progress
        EcosystemService.updateVideoProgress(video.id, 60, video.duration_seconds || 120);
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col mb-8 gap-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    XamSaDine Media
                </h1>
                <p className="text-muted-foreground">
                    Discover Islamic content curated for all ages.
                </p>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="kids">Kids</TabsTrigger>
                    <TabsTrigger value="teens">Teens</TabsTrigger>
                    <TabsTrigger value="adults">Adults</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Loading content...</p>
                    ) : videos.map((video) => (
                        <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-card/50 backdrop-blur-sm">
                            <div className="aspect-video relative bg-slate-900 group cursor-pointer" onClick={() => handleWatch(video)}>
                                {video.thumbnail_url ? (
                                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500">
                                        <PlayCircle size={48} />
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                                    <Clock size={12} />
                                    {Math.floor((video.duration_seconds || 0) / 60)} min
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                                    <Badge variant="secondary">{video.language}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full gap-2" onClick={() => handleWatch(video)}>
                                    <PlayCircle size={16} /> Watch Now
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
