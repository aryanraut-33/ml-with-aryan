'use client';

import { useState } from 'react';
import styles from './ContentToggle.module.css';

// Import all the necessary card components
import FeaturedBlogCard from './FeaturedBlogCard';
import BlogCard from './BlogCard';
import FeaturedVideoCard from './FeaturedVideoCard';
import VideoGridCard from './VideoGridCard';

export default function ContentToggle({ blogs, videos }) {
  const [activeTab, setActiveTab] = useState('blogs');

  // Separate the arrays for both blogs and videos
  const latestBlog = blogs?.[0];
  const olderBlogs = blogs?.slice(1);
  const latestVideo = videos?.[0];
  const olderVideos = videos?.slice(1);

  return (
    <section>
      <div className={styles.toggleHeader}>
        <h2 className={styles.sectionTitle}>Latest Content</h2>
        <div className={styles.toggleButtons}>
          <button
            onClick={() => setActiveTab('blogs')}
            className={activeTab === 'blogs' ? styles.active : ''}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={activeTab === 'videos' ? styles.active : ''}
          >
            Videos
          </button>
        </div>
      </div>

      {activeTab === 'blogs' && (
        <div>
          {latestBlog && (
            <div className={styles.featuredContainer}>
              <FeaturedBlogCard blog={latestBlog} />
            </div>
          )}
          {olderBlogs && olderBlogs.length > 0 && (
            <div className={styles.gridContainer}>
              {olderBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- THIS IS THE DEFINITIVE FIX --- */}
      {/* The videos tab now uses the EXACT SAME JSX structure as the blogs tab. */}
      {activeTab === 'videos' && (
        <div>
          {latestVideo && (
            <div className={styles.featuredContainer}>
              <FeaturedVideoCard video={latestVideo} />
            </div>
          )}
          {olderVideos && olderVideos.length > 0 && (
            <div className={styles.gridContainer}>
              {olderVideos.map((video) => (
                <VideoGridCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}
      {/* ------------------------------------ */}
    </section>
  );
}