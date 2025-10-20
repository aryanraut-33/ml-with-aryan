import Link from 'next/link';
import Image from 'next/image';
import api from 'lib/api';
import styles from './blogs.module.css';
import SortToggle from 'components/SortToggle';

export const dynamic = 'force-dynamic';

async function getBlogs(sort = 'latest') {
  try {
    const res = await api.get(`/api/blogs?sort=${sort}`);
    return res.data;
  } catch (error) { return []; }
}

export default async function BlogsPage({ searchParams }) {
  // --- THIS IS THE FIX ---
  const blogs = await getBlogs(searchParams.sort || 'latest');
  // -----------------------

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>All Blog Posts</h1>
      </div>
      <SortToggle />
      
      <div className={styles.contentGrid}>
        {blogs.map((blog) => (
          <Link href={`/blogs/${blog._id}`} key={blog._id} className={styles.card}>
            <div className={styles.cardImage}>
              {blog.thumbnailUrl && (
                <Image src={blog.thumbnailUrl} alt={blog.title} fill style={{ objectFit: 'cover' }} />
              )}
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{blog.title}</h2>
              <p className={styles.cardMeta}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.views}>{blog.views} views</span>
                <div className={styles.tags}>
                  {blog.tags?.slice(0, 2).map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}