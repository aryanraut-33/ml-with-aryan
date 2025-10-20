'use client'; // This component now needs state, so it must be a client component.

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for the menu button
import styles from './Header.module.css';

const Header = ({ isVisible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className={`${styles.headerContainer} ${!isVisible ? styles.hidden : ''}`}>
        <header className={styles.header}>
          <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
            ML with Aryan
          </Link>
          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <Link href="/blogs">Blogs</Link>
            <Link href="/videos">Videos</Link>
            <Link href="/login" className={styles.adminLink}>Vault</Link>
          </nav>
          {/* Mobile Menu Button */}
          <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </header>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
        <Link href="/blogs" onClick={() => setIsMenuOpen(false)}>Blogs</Link>
        <Link href="/videos" onClick={() => setIsMenuOpen(false)}>Videos</Link>
        <Link href="/login" onClick={() => setIsMenuOpen(false)}>Vault</Link>
      </div>
    </>
  );
};

export default Header;