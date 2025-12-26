import React, { useEffect, useState } from 'react';
import { EcosystemService } from '@/services/ecosystem';
import { Product } from '@/types/ecosystem';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<{ product: Product, quantity: number }[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await EcosystemService.getProducts();
            setProducts(data);
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart([...cart, { product, quantity: 1 }]);
        toast.success(`Added ${product.name} to cart`);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            const items = cart.map(item => ({ productId: item.product.id, quantity: item.quantity }));
            const { paymentUrl } = await EcosystemService.checkout(items, 'wave');

            toast.success("Order created! Redirecting to payment...");
            // Simulate Redirect
            setTimeout(() => {
                window.open(paymentUrl, '_blank');
                setCart([]);
            }, 1000);

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Checkout failed";
            toast.error(message);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
                        XamSaDine Store
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Halal streetwear, books, and accessories.
                    </p>
                </div>

                <Button variant="outline" className="relative" onClick={handleCheckout}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Cart
                    {cart.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 px-2 py-0.5" variant="destructive">
                            {cart.length}
                        </Badge>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <p>Loading products...</p>
                ) : products.map((product) => (
                    <Card key={product.id} className="group overflow-hidden">
                        <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
                            {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <Tag size={48} />
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <p className="text-sm font-bold text-primary">{product.price.toLocaleString()} {product.currency}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => addToCart(product)} disabled={product.stock_quantity === 0}>
                                {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
