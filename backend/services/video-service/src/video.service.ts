import { createClient } from '@supabase/supabase-js';
import { MediaContent, MediaProgress } from '../../../shared/ecosystem-types.js';


let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
    if (supabaseInstance) return supabaseInstance;
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials");
    supabaseInstance = createClient<any>(supabaseUrl, supabaseKey);
    return supabaseInstance;
}

export const VideoService = {
    // Get all videos with optional filtering
    async getVideos(filters?: { audience?: string; language?: string }) {
        const supabase = getSupabase();
        let query = supabase
            .from('media_content')
            .select('*')
            .eq('type', 'video')
            .order('published_at', { ascending: false });

        if (filters?.audience) {
            query = query.eq('audience', filters.audience);
        }
        if (filters?.language) {
            query = query.eq('language', filters.language);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as MediaContent[];
    },

    // Get single video
    async getVideoById(id: string) {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('media_content')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as MediaContent;
    },

    // Update progress
    async updateProgress(userId: string, mediaId: string, seconds: number, totalDuration: number) {
        const supabase = getSupabase();
        const isCompleted = seconds >= (totalDuration * 0.9); // 90% watched = completed

        const { data, error } = await supabase
            .from('media_progress')
            .upsert({
                user_id: userId,
                media_id: mediaId,
                progress_seconds: seconds,
                completed: isCompleted,
                last_watched_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // If completed, log activity
        if (isCompleted) {
            await supabase.from('user_activity').insert({
                user_id: userId,
                activity_type: 'video_watch',
                target_id: mediaId,
                metadata: { completed_at: new Date().toISOString() }
            });
        }

        return data as MediaProgress;
    },

    // Admin: Create Video
    async createVideo(video: Omit<MediaContent, 'id' | 'created_at' | 'published_at'>) {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('media_content')
            .insert({
                ...video,
                type: 'video'
            })
            .select()
            .single();


        if (error) throw error;

        // Index into RAG for Search
        if (data.transcript || data.description) {
            try {
                const { ragService } = await import('../../rag-service/rag.service.js');
                await ragService.ingestDocument(
                    `video_${data.id}`,
                    data.title,
                    `[Video: ${data.title}]\nCategory: ${data.audience}\nLanguage: ${data.language}\nDescription: ${data.description}\n\nTranscript:\n${data.transcript || 'No transcript available.'}`,
                    `video:${data.id}`,
                    'multimedia'
                );
            } catch (err) {
                console.error('Failed to index video:', err);
            }
        }

        return data as MediaContent;
    }
};
