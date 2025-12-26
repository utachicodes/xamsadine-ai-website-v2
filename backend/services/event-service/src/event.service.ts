import { createClient } from '@supabase/supabase-js';
import { Event, EventRegistration } from '../../../shared/ecosystem-types.js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
    if (supabaseInstance) return supabaseInstance;
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials");
    // Cast to any to avoid strict type errors for now
    supabaseInstance = createClient<any>(supabaseUrl, supabaseKey);
    return supabaseInstance;
}

export const EventService = {
    // Get upcoming events
    async getUpcomingEvents(limit = 10) {
        const supabase = getSupabase();
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .gte('start_time', now)
            .order('start_time', { ascending: true })
            .limit(limit);

        if (error) throw error;
        return data as Event[];
    },

    // Get specific event
    async getEventById(id: string) {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Event;
    },

    // Register user for event
    async registerUser(userId: string, eventId: string) {
        const supabase = getSupabase();
        // 1. Check if event is full
        const event = await this.getEventById(eventId);
        if (event.max_attendees) {
            const { count } = await supabase
                .from('event_registrations')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', eventId)
                .eq('status', 'confirmed');

            if (count && count >= event.max_attendees) {
                throw new Error('Event is fully booked');
            }
        }

        // 2. Register
        const { data, error } = await supabase
            .from('event_registrations')
            .insert({
                user_id: userId,
                event_id: eventId,
                status: 'confirmed'
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') throw new Error('Already registered'); // Unique constraint violation
            throw error;
        }

        // 3. Log Activity
        await supabase.from('user_activity').insert({
            user_id: userId,
            activity_type: 'event_register',
            target_id: eventId,
            metadata: { event_title: event.title }
        });

        return data as EventRegistration;
    },

    // Get user's registrations
    async getUserRegistrations(userId: string) {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('event_registrations')
            .select(`
        *,
        event:events(*)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Admin: Create Event
    async createEvent(event: Omit<Event, 'id' | 'created_at'>) {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('events')
            .insert(event)
            .select()
            .single();


        if (error) throw error;

        // Index into RAG
        try {
            const { ragService } = await import('../../rag-service/rag.service.js');
            await ragService.ingestDocument(
                `event_${data.id}`,
                data.title,
                `[Event: ${data.title}]\nLocation: ${data.location_name}\nTime: ${data.start_time}\nDescription: ${data.description}\nMax Attendees: ${data.max_attendees}`,
                `event:${data.id}`,
                'community'
            );
        } catch (err) {
            console.error('Failed to index event:', err);
        }

        return data as Event;
    }
};
