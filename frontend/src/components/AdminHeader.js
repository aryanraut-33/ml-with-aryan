'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiExternalLink, FiLogOut, FiGrid, FiFileText, FiVideo } from 'react-icons/fi';
import styles from './AdminHeader.module.css';

export default function AdminHeader({ onLogout }) {
  const pathname = usePathname();

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerSection}>
        <Link href="/" target="_blank" className={styles.viewSiteButton}>
          <FiExternalLink /> View Site
        </Link>
      </div>
      <nav className={styles.adminNav}>
        <Link href="/admin" className={pathname === '/admin' ? styles.active : ''}>
          <FiGrid /> Dashboard
        </Link>
        <Link href="/admin/blogs" className={pathname.startsWith('/admin/blogs') ? styles.active : ''}>
          <FiFileText /> Manage Blogs
        </Link>
        <Link href="/admin/videos" className={pathname.startsWith('/admin/videos') ? styles.active : ''}>
          <FiVideo /> Manage Videos
        </Link>
      </nav>
      <div className={styles.headerSection}>
        <button onClick={onLogout} className={styles.logoutButton}>
          <FiLogOut /> Logout
        </button>
      </div>
    </header>
  );
}