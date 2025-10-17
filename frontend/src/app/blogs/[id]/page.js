import api from '../../../lib/api';
import styles from './blogDetail.module.css';

// This tells Next.js to render pages on demand
export const dynamic = 'force-dynamic';

async function getBlog(id) {
  try {
    const res = await api.get(`/api/blogs/${id}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return null;
  }
}

export default async function BlogDetailPage({ params }) {
  const { id } = params;
  const blog = await getBlog(id);

  if (!blog) {
    return <p>Blog not found.</p>;
  }

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{blog.title}</h1>
      <div className={styles.meta}>
        <span>By {blog.author.username}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        <span>{blog.views} views</span>
      </div>
      <div className={styles.content}>
        {/* Replace newlines with <br> tags for simple formatting */}
        {blog.content.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className={styles.tags}>
        {blog.tags.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}