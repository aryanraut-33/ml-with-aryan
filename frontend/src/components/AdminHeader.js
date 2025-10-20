'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiExternalLink, FiLogOut, FiGrid, FiFileText, FiVideo, FiMenu, FiX } from 'react-icons/fi';
import styles from './AdminHeader.module.css';

// Accept props to control the mobile menu
export default function AdminHeader({ onLogout, isMenuOpen, setIsMenuOpen }) {
  const pathname = usePathname();

  // Function to close menu on link click
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.adminHeader}>
        <div className={styles.headerSection}>
          <Link href="/" target="_blank" className={styles.viewSiteButton}>
            <FiExternalLink />
            View Site
          </Link>
        </div>
        {/* Desktop Navigation */}
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
            <FiLogOut />
            Logout
          </button>
          {/* Mobile Menu Button */}
          <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>
      {/* Mobile Menu Dropdown */}
      <div className={`${styles.mobileAdminNavWrapper} ${isMenuOpen ? styles.open : ''}`}>
        <nav className={styles.mobileAdminNav}>
          <Link href="/admin" onClick={handleLinkClick}>Dashboard</Link>
          <Link href="/admin/blogs" onClick={handleLinkClick}>Manage Blogs</Link>
          <Link href="/admin/videos" onClick={handleLinkClick}>Manage Videos</Link>
        </nav>
      </div>
    </>
  );
}