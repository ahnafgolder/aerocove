'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
      {/* Gradient accent line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--primary), #7c3aed, var(--accent))' }} />

      <div className="container py-12">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <h3 className="text-xl font-bold text-gradient mb-4">Aerocove BD</h3>
          <p className="text-secondary text-sm" style={{ lineHeight: '1.8' }}>
            Premium, stylish, and protective phone cases delivered right to your doorstep anywhere in Bangladesh.
          </p>
        </div>
      </div>

      <div className="border-t text-center text-secondary text-xs py-6" style={{ borderColor: 'var(--border-light)' }}>
        &copy; {new Date().getFullYear()} Aerocove BD. All rights reserved.
      </div>
    </footer>
  );
}
