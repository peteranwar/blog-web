// src/components/Navbar.js
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <nav className="bg-gray-100 p-4 shadow-md flex justify-between items-center">
      <div className="flex space-x-6">
        <Link href="/posts" className="font-bold hover:underline">
          Blog
        </Link>
        {user && (
          <Link href="/posts/create" className="hover:underline">
            New Post
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">
              Hello, {user.username} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}