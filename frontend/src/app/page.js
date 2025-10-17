export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
import api from '../lib/api';
import { getYoutubeThumbnail } from '../lib/utils';
import styles from './page.module.css'; // Home page specific styles
import blogCardStyles from './blogs/blogs.module.css'; // Reusing blog card styles
import videoCardStyles from './videos/videos.module.css'; // Reusing video card styles

async function getLatestContent() {
  try {
    const res = await api.get('/api/content/latest');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch latest content:', error);
    return { blogs: [], videos: [] };
  }
}

export default async function HomePage() {
  const { blogs, videos } = await getLatestContent();

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Exploring the Frontiers of Machine Learning</h1>
        <p className={styles.heroSubtitle}>
          A curated collection of articles and video tutorials on AI, MLOps, and everything in between.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Latest Articles</h2>
        <div className={blogCardStyles.blogList}>
          {blogs.map((blog) => (
            <Link href={`/blogs/${blog._id}`} key={blog._id} className={blogCardStyles.card}>
              <h3 className={blogCardStyles.cardTitle}>{blog.title}</h3>
              <p className={blogCardStyles.cardMeta}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <div className={blogCardStyles.cardFooter}>
                <span className={blogCardStyles.views}>{blog.views} views</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Latest Videos</h2>
        <div className={videoCardStyles.videoList}>
          {videos.map((video) => (
             <Link href={`/videos/${video._id}`} key={video._id} className={videoCardStyles.card}>
                <div className={videoCardStyles.thumbnail}>
                    <Image
                      src={getYoutubeThumbnail(video.videoUrl)}
                      alt={video.title}
                      width={240} // Smaller size for homepage
                      height={135}
                      style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className={videoCardStyles.cardContent}>
                    <h3 className={videoCardStyles.cardTitle}>{video.title}</h3>
                </div>
             </Link>
          ))}
        </div>
      </section>
    </div>
  );
}