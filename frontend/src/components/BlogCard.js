import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogCard.module.css';

export default function BlogCard({ blog }) {
  if (!blog) {
    return null;
  }

  return (
    <Link href={`/blogs/${blog._id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {blog.thumbnailUrl && <Image src={blog.thumbnailUrl} alt={blog.title} fill style={{ objectFit: 'cover' }} />}
      </div>
      <div className={styles.content}>
        <div className={styles.tags}>
          {blog.tags?.slice(0, 2).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>
        <h4 className={styles.title}>{blog.title}</h4>
        <p className={styles.description}>{blog.description}</p>
        <div className={styles.authorInfo}>
          <div className={styles.authorText}>
            {/* --- THIS IS THE UPDATED LINE --- */}
            <span className={styles.authorName}>{blog.authorName || blog.author?.username || 'Admin'}</span>
            <span className={styles.date}>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}