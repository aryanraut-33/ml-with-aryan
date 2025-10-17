'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isAdmin) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2>Admin Panel</h2>
        <nav>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/blogs">Manage Blogs</Link>
          <Link href="/admin/videos">Manage Videos</Link>
        </nav>
        <button onClick={logout} className={styles.logoutButton}>Logout</button>
      </aside>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}