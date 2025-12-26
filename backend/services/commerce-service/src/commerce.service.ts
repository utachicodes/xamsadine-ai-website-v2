import { createClient } from '@supabase/supabase-js';
import { Product, Order, OrderItem } from '../../../shared/ecosystem-types.js';


let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
    if (supabaseInstance) return supabaseInstance;
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials");
    supabaseInstance = createClient<any>(supabaseUrl, supabaseKey);
    return supabaseInstance;
}

export const CommerceService = {
    // Get all products
    async getProducts(category?: string) {
        const supabase = getSupabase();
        let query = supabase
            .from('products')
            .select('*')
            .gt('stock_quantity', 0) // Only show in-stock
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as Product[];
    },

    async getProductById(id: string) {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Product;
    },

    // Create Order & Initiate Payment
    async createOrder(userId: string, items: { productId: string; quantity: number }[], paymentMethod: string) {
        // 1. Calculate Total & Verify Stock
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await this.getProductById(item.productId);
            if (product.stock_quantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }
            totalAmount += product.price * item.quantity;
            orderItemsData.push({
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: product.price
            });
        }

        // 2. Create Order in DB
        const supabase = getSupabase();
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                total_amount: totalAmount,
                status: 'pending',
                payment_method: paymentMethod
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create Order Items
        const itemsToInsert = orderItemsData.map(item => ({
            ...item,
            order_id: order.id
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(itemsToInsert);

        if (itemsError) throw itemsError;

        // 4. Initiate Payment logic (Mock for now, would call PayTech.sn here)
        const paymentUrl = await this.initiatePaymentGateway(order, paymentMethod);

        return { order, paymentUrl };
    },

    // Mock Payment Gateway Integration
    async initiatePaymentGateway(order: any, method: string) {
        // In production, call PayTech.sn / CinetPay API here
        // return `https://paytech.sn/pay/${token}`;

        console.log(`Fake initiating payment for Order ${order.id} via ${method}`);
        return `https://checkout.xamsadine.com/mock-pay/${order.id}`;
    },

    // Handle Payment Webhook (Success)
    async handlePaymentSuccess(orderId: string) {
        const supabase = getSupabase();
        // Update order status
        const { data: order, error } = await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderId)
            .select()
            .single();

        if (error) throw error;

        // Decrement Inventory
        // Note: This should ideally be a transaction or done via RPC
        const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (items) {
            for (const item of items) {
                await supabase.rpc('decrement_stock', { p_id: item.product_id, q: item.quantity });
            }
        }

        // Log Activity
        await supabase.from('user_activity').insert({
            user_id: order.user_id,
            activity_type: 'purchase',
            target_id: order.id,
            metadata: { amount: order.total_amount }
        });

        return order;
    },

    // Get User Orders
    async getUserOrders(userId: string) {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('orders')
            .select(`
            *,
            items:order_items(
                *,
                product:products(*)
            )
          `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
