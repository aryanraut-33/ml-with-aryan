import Link from 'next/link';
import api from '../../lib/api';
import styles from './blogs.module.css';

// Function to fetch blogs from the API
async function getBlogs() {
  try {
    const res = await api.get('/api/blogs');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return []; // Return an empty array on error
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div>
      <h1 className={styles.title}>All Blog Posts</h1>
      <div className={styles.blogList}>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Link href={`/blogs/${blog._id}`} key={blog._id} className={styles.card}>
              <h2 className={styles.cardTitle}>{blog.title}</h2>
              <p className={styles.cardMeta}>
                By {blog.author.username} on {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.views}>{blog.views} views</span>
                <div className={styles.tags}>
                  {blog.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No blog posts found. The admin should create one!</p>
        )}
      </div>
    </div>
  );
}