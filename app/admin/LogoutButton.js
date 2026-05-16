'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="btn btn-outline py-1 px-3 text-sm"
    >
      Logout
    </button>
  );
}
