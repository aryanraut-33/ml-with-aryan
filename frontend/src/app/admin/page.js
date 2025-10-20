import api from 'lib/api';
import styles from './admin.module.css';
import { FiEye, FiFileText, FiVideo } from 'react-icons/fi';
import PerformanceChart from 'components/PerformanceChart';
import Link from 'next/link';

// Helper functions to fetch data
async function getBlogs() {
  try {
    const res = await api.get('/api/blogs');
    return res.data;
  } catch (error) { 
    console.error("Failed to fetch blogs:", error);
    return []; 
  }
}

async function getVideos() {
  try {
    const res = await api.get('/api/videos');
    return res.data;
  } catch (error) { 
    console.error("Failed to fetch videos:", error);
    return []; 
  }
}

export default async function AdminDashboard() {
  const [blogs, videos] = await Promise.all([getBlogs(), getVideos()]);

  // --- All stat calculations remain the same ---
  const totalBlogs = blogs.length;
  const totalVideos = videos.length;
  const totalBlogViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const totalVideoViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
  const totalViews = totalBlogViews + totalVideoViews;
  const allContent = [...blogs, ...videos].sort((a, b) => (b.views || 0) - (a.views || 0));
  
  const chartData = allContent
    .slice(0, 7)
    .map(post => ({
      title: post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title,
      views: post.views || 0
    }));

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      
      {/* --- THIS IS THE NEW TWO-COLUMN LAYOUT --- */}
      <div className={styles.dashboardLayout}>

        {/* Column 1: The Main Chart */}
        <div className={styles.chartContainer}>
          <h2 className={styles.sectionTitle}>Top Content Performance</h2>
          <PerformanceChart data={chartData} />
        </div>

        {/* Column 2: Stat Cards */}
        <div className={styles.statsColumn}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}><FiEye /> Total Views</h3>
            <p className={styles.statValue}>{totalViews.toLocaleString()}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}><FiFileText /> Articles</h3>
            <p className={styles.statValue}>{totalBlogs}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}><FiVideo /> Videos</h3>
            <p className={styles.statValue}>{totalVideos}</p>
          </div>
        </div>

      </div>
    </div>
  );
}