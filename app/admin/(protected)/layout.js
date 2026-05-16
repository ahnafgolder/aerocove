import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../LogoutButton";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center px-6 border-b" style={{ height: '64px', borderColor: 'var(--border)' }}>
          <Link href="/admin" className="font-bold text-xl text-gradient">Aerocove Admin</Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <Link href="/admin" className="admin-nav-link">📊 Dashboard</Link>
          <Link href="/admin/orders" className="admin-nav-link">📦 Orders</Link>
          <Link href="/admin/products" className="admin-nav-link">🏷️ Products</Link>
          <Link href="/admin/categories" className="admin-nav-link">📂 Categories</Link>
          <Link href="/admin/phone-models" className="admin-nav-link">📱 Phone Models</Link>
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="admin-nav-link text-sm">← Back to Store</Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="flex items-center justify-between px-6 flex-shrink-0 border-b" style={{ height: '64px', background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="md:hidden">
            <Link href="/admin" className="font-bold text-lg text-gradient">Aerocove</Link>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <span className="text-secondary text-sm">Hi, {session.user.name}</span>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
