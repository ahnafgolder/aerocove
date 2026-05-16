'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PhoneModelManager({ phoneModels }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/phone-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      setName('');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    setError('');
    try {
      const res = await fetch(`/api/phone-models/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-alt)' }}>
                <th className="p-4 font-medium text-secondary">Phone Model</th>
                <th className="p-4 font-medium text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {phoneModels.length === 0 ? (
                <tr><td colSpan="2" className="p-8 text-center text-secondary">No phone models yet. Add one to get started.</td></tr>
              ) : (
                phoneModels.map(model => (
                  <tr key={model.id} className="border-t" style={{ borderColor: 'var(--border-light)' }}>
                    <td className="p-4 font-medium">{model.name}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(model.id)}
                        disabled={deleting === model.id}
                        className="text-sm font-medium"
                        style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {deleting === model.id ? '...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="glass-panel p-6 sticky top-24">
          <h2 className="text-lg font-bold mb-4">Add Phone Model</h2>
          {error && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Model Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g. iPhone 16 Pro Max" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Adding...' : 'Add Model'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
