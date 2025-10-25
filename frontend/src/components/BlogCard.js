'use client'; // <-- FIX: This component now uses hooks, so it must be a client component.

import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogCard.module.css';
import { useAuth } from 'context/AuthContext'; // <-- FIX: Import the useAuth hook.
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';

// The 'blog' prop now contains the blog data and its interaction state
export default function BlogCard({ blog, isLiked, isBookmarked }) {
  const { user } = useAuth(); // Check if a user is logged in
  
  if (!blog) return null;

  return (
    <Link href={`/blogs/${blog._id}`} className={styles.card}>
      <div className={styles.cardImage}>
        {blog.thumbnailUrl && (
          <Image
            src={blog.thumbnailUrl}
            alt={blog.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        )}
        {/* Only show the interaction overlay if a user is logged in */}
        {user && (
          <div className={styles.interactionOverlay}>
            <LikeButton
              contentId={blog._id}
              contentType="blog"
              isInitiallyLiked={isLiked}
            />
            <BookmarkButton
              contentId={blog._id}
              contentType="blog"
              isInitiallyBookmarked={isBookmarked}
            />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.tags}>
          {blog.tags?.slice(0, 2).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>
        <h4 className={styles.title}>{blog.title}</h4>
        <p className={styles.description}>{blog.description}</p>
        <div className={styles.authorInfo}>
          <div className={styles.authorText}>
            <span className={styles.authorName}>{blog.authorName || blog.author?.username || 'Admin'}</span>
            <span className={styles.date}>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}