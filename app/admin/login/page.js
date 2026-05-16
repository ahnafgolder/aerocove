'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecff 50%, #f5f0ff 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Aerocove BD</h1>
          <p className="text-secondary">Admin Control Panel</p>
        </div>
        <div className="glass-panel p-8">
          {error && (
            <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.6rem 1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-secondary">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="admin@aerocove.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-secondary">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2 py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
