'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './SortToggle.module.css';

export default function SortToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  return (
    <div className={styles.sortContainer}>
      <Link
        href={`${pathname}?sort=latest`}
        className={`${styles.sortButton} ${currentSort === 'latest' ? styles.active : ''}`}
      >
        Latest
      </Link>
      <Link
        href={`${pathname}?sort=popular`}
        className={`${styles.sortButton} ${currentSort === 'popular' ? styles.active : ''}`}
      >
        Most Popular
      </Link>
    </div>
  );
}