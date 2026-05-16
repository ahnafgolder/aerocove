'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ productId, productName }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch {
      alert('Failed to delete product.');
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm font-medium"
          style={{ color: '#fff', background: 'var(--danger)', border: 'none', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          {deleting ? '...' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm font-medium"
      style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}
    >
      Delete
    </button>
  );
}
