'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../app/blogs/[id]/blogDetail.module.css';

export default function BlogDetailClient({ blog }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!blog) {
    return <p>Blog not found.</p>;
  }

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{blog.title}</h1>
      <div className={styles.meta}>
        {/* --- THIS IS THE UPDATED LINE --- */}
        <span>By {blog.authorName || blog.author?.username || 'Admin'}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        <span>{blog.views} views</span>
      </div>

      {blog.thumbnailUrl && (
        <div className={`${styles.thumbnail} ${isExpanded ? styles.expanded : ''}`}>
          <Image src={blog.thumbnailUrl} alt={blog.title} fill style={{ objectFit: 'contain' }} priority />
          <button className={styles.expandButton} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
          </button>
        </div>
      )}

      <div className={styles.content}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </div>
      <div className={styles.tags}>
        {blog.tags?.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}