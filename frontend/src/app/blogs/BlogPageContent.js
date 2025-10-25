'use client'; // <-- THIS IS THE CRITICAL FIX

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from 'lib/api';
import styles from './blogs.module.css';
import { useAuth } from 'context/AuthContext';
import LikeButton from 'components/LikeButton';
import BookmarkButton from 'components/BookmarkButton';

export default function BlogPageContent() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [interactions, setInteractions] = useState({ liked: [], bookmarked: [] });
  
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'latest';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/blogs?sort=${sort}`);
        setBlogs(res.data);

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
    return <p style={{textAlign: 'center', marginTop: '4rem'}}>Loading articles...</p>;
  }

  return (
    <div className={styles.contentGrid}>
      {blogs.map((blog) => (
        <Link href={`/blogs/${blog._id}`} key={blog._id} className={styles.card}>
          <div className={styles.cardImage}>
            {blog.thumbnailUrl && <Image src={blog.thumbnailUrl} alt={blog.title} fill style={{ objectFit: 'cover' }} />}
            {user && (
              <div className={styles.interactionOverlay}>
                <LikeButton contentId={blog._id} contentType="blog" isInitiallyLiked={interactions.liked.includes(blog._id)} />
                <BookmarkButton contentId={blog._id} contentType="blog" isInitiallyBookmarked={interactions.bookmarked.includes(blog._id)} />
              </div>
            )}
          </div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{blog.title}</h2>
            <p className={styles.cardMeta}>{new Date(blog.createdAt).toLocaleDateString()}</p>
            <div className={styles.cardFooter}>
              <span className={styles.views}>{blog.views || 0} views</span>
              <div className={styles.tags}>
                {blog.tags?.slice(0, 2).map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}