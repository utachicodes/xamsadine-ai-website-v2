
export type ContentType = 'video' | 'podcast_episode';
export type AudienceLevel = 'kids' | 'teens' | 'adults';
export type EventStatus = 'confirmed' | 'waitlist' | 'cancelled';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';
export type PaymentMethod = 'orange_money' | 'wave' | 'card' | 'cash';

export interface UserActivity {
    id: string;
    user_id: string;
    activity_type: 'video_watch' | 'event_register' | 'purchase';
    target_id: string;
    metadata?: Record<string, any>;
    created_at: string;
}

export interface MediaContent {
    id: string;
    title: string;
    description: string;
    type: ContentType;
    url: string;
    thumbnail_url?: string;
    duration_seconds?: number;
    language: string;
    audience: AudienceLevel;
    transcript?: string;
    published_at: string;
    created_at: string;
}

export interface MediaProgress {
    user_id: string;
    media_id: string;
    progress_seconds: number;
    completed: boolean;
    last_watched_at: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time?: string;
    location_name: string;
    location_coordinates?: { x: number; y: number }; // Point
    is_online: boolean;
    max_attendees?: number;
    image_url?: string;
    created_at: string;
}

export interface EventRegistration {
    id: string;
    event_id: string;
    user_id: string;
    status: EventStatus;
    created_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    stock_quantity: number;
    images: string[];
    category: string;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    status: OrderStatus;
    payment_method: PaymentMethod;
    created_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
}
