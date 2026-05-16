'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryManager() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create category');
      }

      setName('');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 sticky top-24">
      <h2 className="text-lg font-bold mb-4">Add New Category</h2>
      
      {error && (
        <div className="bg-danger/20 border border-danger text-danger px-3 py-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input 
            required 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="input" 
            placeholder="e.g. Leather Cases" 
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
}
