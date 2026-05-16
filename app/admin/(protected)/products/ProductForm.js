'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';

export default function ProductForm({ initialData = null, categories = [], phoneModels = [] }) {
  const router = useRouter();
  const isEditing = !!initialData;

  // Parse initial categories (m2m)
  const initialCategoryIds = initialData?.categories?.map(c => c.id) || [];
  // Parse initial variants
  const initialVariants = {};
  if (initialData?.variants) {
    initialData.variants.forEach(v => {
      initialVariants[v.phoneModelId] = v.stock;
    });
  }

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    comparePrice: initialData?.comparePrice?.toString() || '',
    featured: initialData?.featured || false,
    active: initialData?.active ?? true,
    images: initialData?.images ? JSON.parse(initialData.images) : []
  });

  const [categoryIds, setCategoryIds] = useState(initialCategoryIds);
  const [variants, setVariants] = useState(initialVariants); // { phoneModelId: stock }
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value,
        ...(!isEditing && !prev.slug ? { slug: slugify(value) } : {})
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleCategory = (catId) => {
    setCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const toggleVariant = (modelId) => {
    setVariants(prev => {
      const next = { ...prev };
      if (modelId in next) {
        delete next[modelId];
      } else {
        next[modelId] = 0;
      }
      return next;
    });
  };

  const updateVariantStock = (modelId, stock) => {
    setVariants(prev => ({ ...prev, [modelId]: parseInt(stock, 10) || 0 }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const variantsArray = Object.entries(variants).map(([phoneModelId, stock]) => ({
        phoneModelId,
        stock: parseInt(stock, 10) || 0
      }));

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        categoryIds,
        variants: variantsArray,
      };

      const url = isEditing ? `/api/products/${initialData.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">Basic Info</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL friendly) *</label>
                <input required name="slug" value={formData.slug} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input" rows="5" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (৳) *</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="input" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Compare at Price (৳)</label>
                <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleChange} className="input" min="0" step="0.01" placeholder="Original price" />
              </div>
            </div>
          </div>

          {/* Phone Model Variants & Stock */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-2 border-b border-border pb-2">Phone Models & Stock</h2>
            <p className="text-xs text-secondary mb-4">Select which phone models this product is available for and set stock for each.</p>

            {phoneModels.length === 0 ? (
              <div className="py-6 text-center text-secondary border border-dashed border-border rounded-md">
                No phone models created yet. <a href="/admin/phone-models" className="text-primary font-medium">Add phone models first →</a>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {phoneModels.map(model => {
                  const isActive = model.id in variants;
                  return (
                    <div key={model.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: isActive ? 'var(--primary-light)' : 'var(--surface-alt)', border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-light)'}`, transition: 'all 0.2s' }}>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => toggleVariant(model.id)}
                        className="w-4 h-4"
                      />
                      <span className="font-medium text-sm flex-1">{model.name}</span>
                      {isActive && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-secondary">Stock:</label>
                          <input
                            type="number"
                            value={variants[model.id]}
                            onChange={e => updateVariantStock(model.id, e.target.value)}
                            className="input"
                            min="0"
                            style={{ width: '80px', padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">Images</h2>
            <p className="text-xs text-secondary mb-4">Enter direct image URLs (e.g. from Imgur or CDN).</p>
            
            <div className="flex gap-2 mb-4">
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="input flex-grow" placeholder="https://example.com/image.jpg" />
              <button type="button" onClick={handleAddImage} className="btn btn-secondary bg-surface border border-border">Add</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-md overflow-hidden bg-surface border border-border">
                  <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-1 right-1 bg-danger text-white w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className="col-span-full py-8 text-center text-secondary border border-dashed border-border rounded-md">No images added</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Categories - Multi-select checkboxes */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">Categories</h2>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-md" style={{ background: categoryIds.includes(cat.id) ? 'var(--primary-light)' : 'transparent', transition: 'background 0.2s' }}>
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">{cat.name}</span>
                </label>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-secondary">No categories. <a href="/admin/categories" className="text-primary">Create one →</a></p>
              )}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">Status</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-4 h-4 rounded border-border" />
                <span className="text-sm font-medium">Active (Visible on store)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 rounded border-border" />
                <span className="text-sm font-medium">Featured (Show on homepage)</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary py-3">
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  );
}
