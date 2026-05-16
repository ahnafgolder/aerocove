'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStatusColor } from '@/lib/utils';

export default function OrderStatusSelect({ orderId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed');
      router.refresh();
    } catch (error) {
      alert('Failed to update status');
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={loading}
      className="input font-medium"
      style={{
        width: 'auto',
        padding: '0.5rem 2rem 0.5rem 0.75rem',
        backgroundColor: `${getStatusColor(status)}12`,
        borderColor: `${getStatusColor(status)}40`,
        color: getStatusColor(status),
        appearance: 'auto',
        fontWeight: 600,
        fontSize: '0.8rem'
      }}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
