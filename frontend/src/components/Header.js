'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from './Header.module.css';
import { useAuth } from 'context/AuthContext';

const Header = ({ isVisible }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.headerContainer} ${!isVisible ? styles.hidden : ''
          }`}
      >
        <header className={styles.header}>
          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={handleLinkClick}>
            ML with Aryan
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <Link href="/blogs">Blogs</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/videos">Videos</Link>
            {user ? (
              <>
                <Link href="/profile">My Vault</Link>
                {user.isAdmin && <Link href="/admin">Admin Panel</Link>}
                <button onClick={logout} className={styles.logoutButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/signup">Sign Up</Link>
                <Link href="/login" className={styles.adminLink}>
                  Login
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </header>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''
          }`}
      >
        <Link href="/blogs" onClick={handleLinkClick}>
          Blogs
        </Link>
        <Link href="/projects" onClick={handleLinkClick}>
          Projects
        </Link>
        <Link href="/videos" onClick={handleLinkClick}>
          Videos
        </Link>
        {user ? (
          <>
            <Link href="/profile" onClick={handleLinkClick}>
              My Vault
            </Link>
            {user.isAdmin && (
              <Link href="/admin" onClick={handleLinkClick}>
                Admin Panel
              </Link>
            )}
            <button
              className={styles.mobileLogoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/signup" onClick={handleLinkClick}>
              Sign Up
            </Link>
            <Link href="/login" onClick={handleLinkClick}>
              Login
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Header;
