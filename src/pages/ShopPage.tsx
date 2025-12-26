import React, { useEffect, useState } from 'react';
import { EcosystemService } from '@/services/ecosystem';
import { Product } from '@/types/ecosystem';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

export default function ShopPage() {
    const { t } = useLanguage();
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
            setProducts(data.length > 0 ? data : MOCK_PRODUCTS);
        } catch (error) {
            // Use mock data for now
            console.warn('Using mock products data');
            setProducts(MOCK_PRODUCTS);
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
        <div className="flex-1">
            <section className="container py-10 md:py-16 space-y-10">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-islamic-dark/60 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-islamic-gold mr-2" />
                            {t('shop.title')}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold text-islamic-dark">
                            {t('shop.subtitle')}
                        </h1>
                        <p className="mt-2 text-islamic-dark/70 max-w-xl">
                            {t('shop.intro')}
                        </p>
                    </div>

                    <Button variant="outline" className="relative border-islamic-gold/30 hover:border-islamic-gold" onClick={handleCheckout}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Cart
                        {cart.length > 0 && (
                            <Badge className="absolute -top-2 -right-2 px-2 py-0.5 bg-islamic-green text-white">
                                {cart.length}
                            </Badge>
                        )}
                    </Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-islamic-dark/70">{t('shop.loading')}</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-islamic-dark/70">{t('shop.empty')}</p>
                        </div>
                    ) : products.map((product) => (
                        <div key={product.id} className="islamic-card group overflow-hidden hover:scale-[1.02] transition-transform">
                            <div className="aspect-square bg-islamic-cream/30 relative overflow-hidden rounded-t-lg">
                                {product.images && product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-islamic-dark/40">
                                        <Tag size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="p-6 space-y-3">
                                <h3 className="text-lg font-semibold text-islamic-dark">{product.name}</h3>
                                <p className="text-lg font-bold text-islamic-gold">{product.price.toLocaleString()} {product.currency}</p>
                                <p className="text-sm text-islamic-dark/70 line-clamp-2">{product.description}</p>
                                <Button 
                                    className="w-full btn-islamic" 
                                    onClick={() => addToCart(product)} 
                                    disabled={product.stock_quantity === 0}
                                >
                                    {product.stock_quantity > 0 ? t('shop.add_to_cart') : t('shop.out_of_stock')}
                                </Button>
                            </div>
                        </div>
                )                )}
                </div>
            </section>
        </div>
    );
}
