import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Product } from '@/types/ecosystem';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function ManageProducts() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        currency: 'XOF',
        stock_quantity: '',
        category: 'clothing',
        images: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setProducts(products.map(p => 
                p.id === editingId 
                    ? { 
                        ...p, 
                        ...formData, 
                        price: parseFloat(formData.price),
                        stock_quantity: parseInt(formData.stock_quantity),
                        images: formData.images ? [formData.images] : [],
                    }
                    : p
            ));
            toast.success('Product updated successfully');
            setEditingId(null);
        } else {
            const newProduct: Product = {
                id: `product-${Date.now()}`,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                currency: formData.currency,
                stock_quantity: parseInt(formData.stock_quantity),
                category: formData.category,
                images: formData.images ? [formData.images] : [],
                created_at: new Date().toISOString(),
            };
            setProducts([newProduct, ...products]);
            toast.success('Product created successfully');
            setIsCreating(false);
        }
        setFormData({
            name: '',
            description: '',
            price: '',
            currency: 'XOF',
            stock_quantity: '',
            category: 'clothing',
            images: '',
        });
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            currency: product.currency,
            stock_quantity: product.stock_quantity.toString(),
            category: product.category,
            images: product.images?.[0] || '',
        });
        setIsCreating(true);
    };

    const handleDelete = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
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
                            Manage <span className="text-gradient">Products</span>
                        </h1>
                    </div>
                    <Button 
                        onClick={() => {
                            setIsCreating(true);
                            setEditingId(null);
                            setFormData({
                                name: '',
                                description: '',
                                price: '',
                                currency: 'XOF',
                                stock_quantity: '',
                                category: 'clothing',
                                images: '',
                            });
                        }}
                        className="btn-islamic"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </header>

                {isCreating && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30">
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Price</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Currency</label>
                                        <select
                                            value={formData.currency}
                                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="XOF">XOF</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Stock Quantity</label>
                                        <Input
                                            type="number"
                                            value={formData.stock_quantity}
                                            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="clothing">Clothing</option>
                                            <option value="books">Books</option>
                                            <option value="accessories">Accessories</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Image URL</label>
                                        <Input
                                            placeholder="Image URL"
                                            value={formData.images}
                                            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                                        />
                                    </div>
                                </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="bg-white/80 backdrop-blur-sm border border-islamic-gold/30 overflow-hidden">
                            <div className="aspect-square bg-islamic-cream/30 relative">
                                {product.images && product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Tag size={48} className="text-islamic-dark/40" />
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-islamic-dark">{product.name}</h3>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-islamic-gold mb-2">
                                    {product.price.toLocaleString()} {product.currency}
                                </p>
                                <p className="text-sm text-islamic-dark/70 line-clamp-2 mb-3">{product.description}</p>
                                <div className="flex gap-2 items-center">
                                    <Badge>{product.category}</Badge>
                                    <span className="text-xs text-islamic-dark/60">
                                        Stock: {product.stock_quantity}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}

