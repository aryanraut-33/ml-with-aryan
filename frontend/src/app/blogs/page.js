import { Suspense } from 'react';
import styles from './blogs.module.css';
import SortToggle from 'components/SortToggle';
import BlogPageContent from './BlogPageContent'; // <-- Import the new component

// This is now a clean Server Component.
export default function BlogsPage() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>All Blog Posts</h1>
      </div>
      <SortToggle />
      
      <Suspense fallback={<p style={{textAlign: 'center', marginTop: '4rem'}}>Loading articles...</p>}>
        <BlogPageContent />
      </Suspense>
    </div>
  );
}