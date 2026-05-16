'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, isLoaded } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (pathname.startsWith('/admin')) return null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderColor: 'var(--border-light)' }}>
        <div className="container flex items-center justify-between" style={{ height: '64px' }}>
          <Link href="/" className="text-xl font-bold text-gradient" style={{ letterSpacing: '-0.02em' }}>
            Aerocove BD
          </Link>

          {/* Desktop Navigation */}
          <div className="flex gap-8 items-center desktop-nav">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-sm"
                style={{
                  color: pathname === link.href ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'color 0.2s',
                  position: 'relative',
                }}
              >
                {link.label}
                {pathname === link.href && (
                  <span style={{
                    position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
                    width: '16px', height: '2px', background: 'var(--primary)', borderRadius: '1px',
                  }} />
                )}
              </Link>
            ))}
            <Link href="/cart" className="relative font-medium text-sm flex items-center gap-1" style={{ color: pathname === '/cart' ? 'var(--primary)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              Cart
              {isLoaded && cartCount > 0 && (
                <span className="animate-bounce-in flex items-center justify-center rounded-full text-white text-xs font-bold" style={{ position: 'absolute', top: '-10px', right: '-16px', width: '20px', height: '20px', background: 'var(--primary)', fontSize: '0.65rem' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="mobile-nav-actions">
            <Link href="/cart" className="relative" style={{ color: 'var(--text)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {isLoaded && cartCount > 0 && (
                <span className="animate-bounce-in flex items-center justify-center rounded-full text-white text-xs font-bold" style={{ position: 'absolute', top: '-8px', right: '-10px', width: '18px', height: '18px', background: 'var(--primary)', fontSize: '0.6rem' }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-drawer ${menuOpen ? 'active' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-bold text-gradient">Menu</span>
          <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}>
            ✕
          </button>
        </div>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <Link href="/cart">
          Cart {isLoaded && cartCount > 0 && `(${cartCount})`}
        </Link>
      </div>
    </>
  );
}
