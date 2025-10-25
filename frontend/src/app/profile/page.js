'use client';

import { useEffect, useState } from 'react';
import { useAuth } from 'context/AuthContext';
import { useRouter } from 'next/navigation';
import api from 'lib/api';
import BookmarkCard from 'components/BookmarkCard'; // <-- IMPORT NEW CARD
import styles from './profile.module.css'; // <-- USE A DEDICATED STYLESHEET

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState({ blogs: [], videos: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      const fetchBookmarks = async () => {
        try {
          const res = await api.get('/api/users/profile/bookmarks');
          setBookmarks(res.data);
        } catch (error) {
          console.error("Failed to fetch bookmarks", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBookmarks();
    }
  }, [user, loading, router]);

  if (isLoading || loading) {
    return <p className={styles.loadingText}>Loading Vault...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Vault</h1>
      </div>

      <h2 className={styles.sectionTitle}>Bookmarked Articles</h2>
      {bookmarks.blogs.length > 0 ? (
        <div className={styles.listContainer}>
          {bookmarks.blogs.map(blog => <BookmarkCard key={blog._id} item={blog} />)}
        </div>
      ) : (
        <p className={styles.emptyText}>You haven&apos;t bookmarked any articles yet.</p>
      )}

      <h2 className={`${styles.sectionTitle}`} style={{ marginTop: '4rem' }}>Bookmarked Videos</h2>
      {bookmarks.videos.length > 0 ? (
        <div className={styles.listContainer}>
          {bookmarks.videos.map(video => <BookmarkCard key={video._id} item={video} />)}
        </div>
      ) : (
        <p className={styles.emptyText}>You haven&apos;t bookmarked any articles yet.</p>
      )}
    </div>
  );
}