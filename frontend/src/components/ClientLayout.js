'use client';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import Background from './Background';
import Header from './Header'; // Public header
import AdminHeader from './AdminHeader'; // Admin header
import Footer from './Footer';
import MouseAura from './MouseAura';
import { useState, useEffect } from 'react';

// Inner layout manager (can use hooks)
function LayoutManager({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  // --- Handle header visibility on scroll ---
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Show when scrolling up, hide when scrolling down
      if (window.scrollY < lastScrollY || window.scrollY < 50) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Special case: login page (no header/footer/background) ---
  if (isLoginPage) {
    return (
      <main
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff',
        }}
      >
        {children}
      </main>
    );
  }

  // --- Layout rendering ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MouseAura />
      <Background />

      {/* Conditional header */}
      {isAdminRoute ? (
        user && user.isAdmin && <AdminHeader onLogout={logout} />
      ) : (
        <Header isVisible={isHeaderVisible} />
      )}

      {/* Main content area */}
      <main style={{ flex: 1, paddingTop: isAdminRoute ? '100px' : '80px' }}>
        {children}
      </main>

      {/* Footer only for public pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

// --- Main export with AuthProvider wrapper ---
export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutManager>{children}</LayoutManager>
    </AuthProvider>
  );
}
