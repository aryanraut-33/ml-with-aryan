'use client';

import { useState, useEffect } from 'react';
import api from 'lib/api';
import styles from './admin.module.css';
import { FiEye, FiFileText, FiVideo, FiHeart, FiBookmark } from 'react-icons/fi';
import PerformanceChart from 'components/PerformanceChart';
import { useAuth } from 'context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          const [blogsRes, videosRes, adminStatsRes] = await Promise.all([
            api.get('/api/blogs'), api.get('/api/videos'), api.get('/api/admin/stats'),
          ]);
          const blogs = blogsRes.data;
          const videos = videosRes.data;
          const adminStats = adminStatsRes.data;
          
          const totalBlogViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
          const totalVideoViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
          
          setStats({
            totalViews: totalBlogViews + totalVideoViews,
            totalBlogs: blogs.length, totalVideos: videos.length,
            totalLikes: adminStats.totalLikes, totalBookmarks: adminStats.totalBookmarks,
          });

          const allContent = [...blogs, ...videos].sort((a, b) => (b.views || 0) - (a.views || 0));
          setChartData(allContent.slice(0, 7).map(post => ({
            title: post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title,
            views: post.views || 0,
          })));
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      {stats && (
        <div className={styles.dashboardLayout}>
          <div className={styles.chartContainer}>
            <h2 className={styles.sectionTitle}>Top Content Performance</h2>
            <PerformanceChart data={chartData} />
          </div>
          <div className={styles.statsColumn}>
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}><FiEye /> Total Views</h3>
              <p className={styles.statValue}>{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}><FiFileText /> Articles</h3>
              <p className={styles.statValue}>{stats.totalBlogs}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}><FiVideo /> Videos</h3>
              <p className={styles.statValue}>{stats.totalVideos}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}><FiHeart /> Total Likes</h3>
              <p className={styles.statValue}>{stats.totalLikes.toLocaleString()}</p>
            </div>
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}><FiBookmark /> Total Bookmarks</h3>
              <p className={styles.statValue}>{stats.totalBookmarks.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}