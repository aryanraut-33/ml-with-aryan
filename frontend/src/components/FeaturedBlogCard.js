import Link from 'next/link';
import Image from 'next/image';
import { FiArrowUpRight } from 'react-icons/fi';
import styles from './FeaturedBlogCard.module.css';

export default function FeaturedBlogCard({ blog }) {
  return (
    <Link href={`/blogs/${blog._id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {blog.thumbnailUrl && <Image src={blog.thumbnailUrl} alt={blog.title} fill style={{ objectFit: 'cover' }} />}
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <div className={styles.tags}>
            {blog.tags?.slice(0, 2).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
          </div>
        </div>
        <h3 className={styles.title}>{blog.title}</h3>
        <p className={styles.description}>{blog.description}</p>
        
        {/* Author info and Read More link */}
        <div className={styles.footer}>
          <div className={styles.authorInfo}>
            <div className={styles.authorText}>
              {/* --- THIS IS THE UPDATED LINE --- */}
              <span className={styles.authorName}>By {blog.authorName || blog.author?.username || 'Admin'}</span>
              <span className={styles.date}>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <span className={styles.readMore}>
            Read Article <FiArrowUpRight />
          </span>
        </div>
      </div>
    </Link>
  );
}