'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // ✅ added
import Link from 'next/link';
import Image from 'next/image';
import api from 'lib/api';
import styles from './blogs.module.css';
import SortToggle from 'components/SortToggle';
import { useAuth } from 'context/AuthContext'; // ✅ added
import LikeButton from 'components/LikeButton'; // ✅ added
import BookmarkButton from 'components/BookmarkButton'; // ✅ added

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [interactions, setInteractions] = useState({ liked: [], bookmarked: [] });

  // ✅ UPDATED: Use searchParams hook instead of prop
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'latest';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/blogs?sort=${sort}`);
        setBlogs(res.data);

        // ✅ UPDATED: Fetch interactions only if user exists
        if (user && res.data.length > 0) {
          const contentIds = res.data.map(b => b._id);
          const interactionRes = await api.post('/api/users/interactions', { contentIds });
          setInteractions(interactionRes.data);
        } else {
          setInteractions({ liked: [], bookmarked: [] });
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [sort, user]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading articles...</p>;
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>All Blogs</h1>
      </div>
      <SortToggle />
      
      <div className={styles.contentGrid}>
        {blogs.map((blog) => (
          <Link href={`/blogs/${blog._id}`} key={blog._id} className={styles.card}>
            <div className={styles.cardImage}>
              {blog.thumbnailUrl && (
                <Image
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              )}

              {/* --- THIS IS THE FIX (Issue C) --- */}
              {user && (
                <div className={styles.interactionOverlay}>
                  <LikeButton
                    contentId={blog._id}
                    contentType="blog"
                    isInitiallyLiked={interactions.liked.includes(blog._id)}
                  />
                  <BookmarkButton
                    contentId={blog._id}
                    contentType="blog"
                    isInitiallyBookmarked={interactions.bookmarked.includes(blog._id)}
                  />
                </div>
              )}
              {/* ---------------------------------- */}
            </div>

            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{blog.title}</h2>
              <p className={styles.cardMeta}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.views}>{blog.views} views</span>
                <div className={styles.tags}>
                  {blog.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
