'use client';

import { AuthProvider, useAuth } from 'context/AuthContext';
import { usePathname } from 'next/navigation';
import Background from './Background';
import Header from './Header';
import AdminHeader from './AdminHeader';
import Footer from './Footer';
import MouseAura from './MouseAura';
import { useState, useEffect } from 'react';
import styles from './ClientLayout.module.css';
import Link from 'next/link'; // ✅ Added
import { FiHome } from 'react-icons/fi'; // ✅ Added

// Inner component to access hooks, which must be inside a Provider
function LayoutManager({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  // Determine the current route type
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  // Effect for hiding the public header on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY < lastScrollY || window.scrollY < 50) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
      lastScrollY = window.scrollY;
    };
    // Only apply this scroll effect on public pages
    if (!isAdminRoute && !isAuthRoute) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, isAdminRoute, isAuthRoute]);

  // --- ✅ UPDATED AUTH PAGE LAYOUT ---
  if (isAuthRoute) {
    return (
      <main className={styles.authContainer}>
        {/* ✅ Subtle grid background */}
        <div className={styles.authGrid}></div>

        {/* ✅ "Back to Site" Home Button */}
        <Link href="/" className={styles.homeLink}>
          <span className={styles.homeLinkText}>Back to Site</span>
          <FiHome />
        </Link>

        {children}
      </main>
    );
  }
  // -----------------------------------

  // Otherwise, render the standard site layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MouseAura />
      <Background />

      {isAdminRoute ? (
        user &&
        user.isAdmin && (
          <AdminHeader
            onLogout={logout}
            isMenuOpen={isAdminMenuOpen}
            setIsMenuOpen={setIsAdminMenuOpen}
          />
        )
      ) : (
        <Header isVisible={isHeaderVisible} />
      )}

      <main
        className={`${styles.mainContent} ${
          isAdminRoute ? styles.adminLayout : styles.publicLayout
        }`}
      >
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

// The main export that wraps everything in the AuthProvider
export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutManager>{children}</LayoutManager>
    </AuthProvider>
  );
}
