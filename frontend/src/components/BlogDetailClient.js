'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import Katex CSS
import styles from 'app//blogs/[id]/blogDetail.module.css';
import { useAuth } from 'context/AuthContext';
import api from 'lib/api';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import ShareButton from './ShareButton';
import BlockRenderer from './BlockRenderer';

export default function BlogDetailClient({ blog }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const [interactions, setInteractions] = useState({ liked: false, bookmarked: false });

  useEffect(() => {
    if (user && blog) {
      const fetchInteractions = async () => {
        try {
          const res = await api.post('/api/users/interactions', { contentIds: [blog._id] });
          setInteractions({
            liked: res.data.liked.includes(blog._id),
            bookmarked: res.data.bookmarked.includes(blog._id),
          });
        } catch (error) {
          console.error('Error fetching interactions:', error);
        }
      };
      fetchInteractions();
    }
  }, [user, blog]);

  if (!blog) return <p>Blog not found.</p>;

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{blog.title}</h1>
      <div className={styles.meta}>
        <span>By {blog.authorName || blog.author?.username || 'Admin'}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        <span>{blog.views || 0} views</span>

        {/* Second Line: Project Link and Actions */}
        <div style={{
          flexBasis: '100%',
          marginTop: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', /* Spread them out or use gap */
          flexWrap: 'wrap',
          gap: '1rem'
        }}>

          {/* Left: Project Link (if exists) */}
          {blog.projectLink ? (
            <a
              href={blog.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                background: '#334155',
                color: '#e2e8f0',
                borderRadius: '8px', /* Rectangle with rounded edges */
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '500',
                border: '1px solid #475569'
              }}
            >
              View Related Project
            </a>
          ) : <span></span> /* Empty span to keep space-between layout if no link? Or just normal flex */}

          {/* Right: Share / Actions */}
          <div className={styles.interactionContainer} style={{ marginLeft: 0 }}>
            <ShareButton />
          </div>
        </div>
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
        {blog.blocks && blog.blocks.length > 0 ? (
          <BlockRenderer blocks={blog.blocks} styles={styles} />
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {blog.content}
          </ReactMarkdown>
        )}
      </div>
      <div className={styles.tags}>
        {blog.tags?.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
      </div>
    </article>
  );
}