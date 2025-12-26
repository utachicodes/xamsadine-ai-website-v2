import { Router, Request, Response } from 'express';
import { CommerceService } from '../commerce.service.js';
import { requireAuth, requireAdmin } from '../../../api-gateway/src/auth.ts';

export const commerceRoutes = Router();

// Get products
commerceRoutes.get('/products', async (req: Request, res: Response) => {
    try {
        const category = req.query.category as string;
        const products = await CommerceService.getProducts(category);
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

commerceRoutes.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const product = await CommerceService.getProductById(req.params.id);
        res.json(product);
    } catch (error: any) {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Create Order (Checkout)
commerceRoutes.post('/checkout', requireAuth, async (req: Request & { user?: any }, res: Response) => {
    try {
        const { items, paymentMethod } = req.body; // items: [{ productId, quantity }]
        const result = await CommerceService.createOrder(
            req.user.id,
            items,
            paymentMethod
        );
        res.json(result); // Returns { order, paymentUrl }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook for Payment Gateway (Public, secured by signature in real app)
commerceRoutes.post('/webhook/payment', async (req: Request, res: Response) => {
    try {
        const { orderId, status } = req.body;
        if (status === 'success') {
            await CommerceService.handlePaymentSuccess(orderId);
        }
        res.json({ received: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// My Orders
commerceRoutes.get('/orders', requireAuth, async (req: Request & { user?: any }, res: Response) => {
    try {
        const orders = await CommerceService.getUserOrders(req.user.id);
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
