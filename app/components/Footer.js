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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ alignItems: 'start' }}>
          <div>
            <h3 className="text-xl font-bold text-gradient mb-4">Aerocove BD</h3>
            <p className="text-secondary text-sm" style={{ lineHeight: '1.8', maxWidth: '280px' }}>
              Premium, stylish, and protective phone cases delivered right to your doorstep anywhere in Bangladesh.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {[
                { label: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Instagram', icon: 'M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7.5a1 1 0 110-2 1 1 0 010 2z' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: 'var(--text-secondary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.icon} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Quick Links</h4>
            <ul className="flex flex-col gap-3 text-secondary text-sm">
              <li><Link href="/shop" style={{ transition: 'color 0.2s' }}>All Products</Link></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>About Us</a></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Support</h4>
            <ul className="flex flex-col gap-3 text-secondary text-sm">
              <li><a href="#" style={{ transition: 'color 0.2s' }}>FAQ</a></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>Shipping Policy</a></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>Return Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t text-center text-secondary text-xs py-6" style={{ borderColor: 'var(--border-light)' }}>
        &copy; {new Date().getFullYear()} Aerocove BD. All rights reserved.
      </div>
    </footer>
  );
}
