import { Suspense } from 'react';
import styles from '../blogs/blogs.module.css'; // Using the unified blogs stylesheet
import SortToggle from 'components/SortToggle';
import VideoPageContent from './VideoPageContent'; // <-- Import the new component

// This is now a clean Server Component.
export default function VideosPage() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>All Video Resources</h1>
      </div>
      <SortToggle />
      
      {/* --- THIS IS THE FIX --- */}
      {/* We wrap the component that uses the hook in a Suspense boundary. */}
      <Suspense fallback={<p style={{textAlign: 'center', marginTop: '4rem'}}>Loading videos...</p>}>
        <VideoPageContent />
      </Suspense>
      {/* ----------------------- */}
    </div>
  );
}