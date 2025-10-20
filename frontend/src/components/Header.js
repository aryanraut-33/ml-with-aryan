import Link from 'next/link';
import styles from './Header.module.css';

// Accept the isVisible prop
const Header = ({ isVisible }) => {
  return (
    // Conditionally apply the 'hidden' class
    <div className={`${styles.headerContainer} ${!isVisible ? styles.hidden : ''}`}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          ML with Aryan {/* <-- LOGO TEXT FIX */}
        </Link>
        <nav className={styles.nav}>
          <Link href="/blogs">Blogs</Link>
          <Link href="/videos">Videos</Link>
          <Link href="/login" className={styles.adminLink}>Vault</Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;