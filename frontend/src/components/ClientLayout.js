'use client';

import { AuthProvider, useAuth } from 'context/AuthContext';
import { usePathname } from 'next/navigation';
import Background from './Background';
import Header from './Header'; // Public Header
import AdminHeader from './AdminHeader'; // Admin Header
import Footer from './Footer';
import MouseAura from './MouseAura';
import { useState, useEffect } from 'react';
import styles from './ClientLayout.module.css';// We can use this for some shared styles

// Inner component to access hooks
function LayoutManager({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false); // New state for admin mobile menu

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  // Effect for hiding public header on scroll
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
    // Only apply this effect to public pages
    if (!isAdminRoute && !isLoginPage) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, isAdminRoute, isLoginPage]);

  if (isLoginPage) {
    return <main className={styles.loginMain}>{children}</main>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MouseAura />
      <Background />
      
      {isAdminRoute ? (
        // Render Admin Header only if user is a logged-in admin
        user && user.isAdmin && (
          <AdminHeader 
            onLogout={logout} 
            isMenuOpen={isAdminMenuOpen}
            setIsMenuOpen={setIsAdminMenuOpen} 
          />
        )
      ) : (
        // Render Public Header for all other pages
        <Header isVisible={isHeaderVisible} />
      )}
      
      <main style={{ flex: 1, paddingTop: isAdminRoute ? '120px' : '80px' }}>
        {children}
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

// Main export that provides the authentication context
export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutManager>{children}</LayoutManager>
    </AuthProvider>
  );
}