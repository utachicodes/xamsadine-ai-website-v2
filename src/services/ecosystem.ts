import { apiFetch } from '@/lib/api';
import { MediaContent, Event, Product, Order } from '@/types/ecosystem';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:4000/api';

export const EcosystemService = {
    // --- MEDIA ---
    async getVideos(audience?: string, language?: string): Promise<MediaContent[]> {
        const params = new URLSearchParams();
        if (audience) params.append('audience', audience);
        if (language) params.append('language', language);

        const res = await apiFetch(`${API_BASE}/media/video?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
    },

    async updateVideoProgress(id: string, progressSeconds: number, totalDuration: number) {
        const res = await apiFetch(`${API_BASE}/media/video/${id}/progress`, {
            method: 'POST',
            body: JSON.stringify({ progressSeconds, totalDuration }),
        });
        if (!res.ok) throw new Error('Failed to update progress');
        return res.json();
    },

    // --- EVENTS ---
    async getEvents(): Promise<Event[]> {
        const res = await apiFetch(`${API_BASE}/events`);
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
    },

    async registerForEvent(eventId: string) {
        const res = await apiFetch(`${API_BASE}/events/${eventId}/register`, {
            method: 'POST'
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Registration failed');
        }
        return res.json();
    },

    async getMyRegistrations() {
        const res = await apiFetch(`${API_BASE}/events/my/registrations`);
        if (!res.ok) throw new Error('Failed to fetch registrations');
        return res.json();
    },

    // --- SHOP ---
    async getProducts(category?: string): Promise<Product[]> {
        const params = new URLSearchParams();
        if (category) params.append('category', category);

        const res = await apiFetch(`${API_BASE}/shop/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    },

    async checkout(items: { productId: string; quantity: number }[], paymentMethod: string) {
        const res = await apiFetch(`${API_BASE}/shop/checkout`, {
            method: 'POST',
            body: JSON.stringify({ items, paymentMethod })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Checkout failed');
        }
        return res.json(); // { order, paymentUrl }
    }
};
