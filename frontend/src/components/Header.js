import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          abc.com
        </Link>
        <nav className={styles.nav}>
          <Link href="/blogs">Blogs</Link>
          <Link href="/videos">Videos</Link>
          <Link href="/login">Admin</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;