'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from 'lib/api';
import { getYoutubeThumbnail } from 'lib/utils';
import styles from './videos.module.css';
import SortToggle from 'components/SortToggle';
import { useAuth } from 'context/AuthContext';
import LikeButton from 'components/LikeButton';
import BookmarkButton from 'components/BookmarkButton';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [interactions, setInteractions] = useState({ liked: [], bookmarked: [] });

  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'latest';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/videos?sort=${sort}`);
        setVideos(res.data);

        if (user && res.data.length > 0) {
          const contentIds = res.data.map(v => v._id);
          const interactionRes = await api.post('/api/users/interactions', { contentIds });
          setInteractions(interactionRes.data);
        } else {
          setInteractions({ liked: [], bookmarked: [] });
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [sort, user]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading videos...</p>;
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>All Videos</h1>
      </div>
      <SortToggle />
      <div className={styles.contentGrid}>
        {videos.map((video) => (
          <Link href={`/videos/${video._id}`} key={video._id} className={styles.card}>
            <div className={styles.cardImage}>
              {video.videoUrl && (
                <Image
                  src={getYoutubeThumbnail(video.videoUrl)}
                  alt={video.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              )}
              
              {/* ✅ Overlay Like/Bookmark buttons (same fix as BlogsPage) */}
              {user && (
                <div className={styles.interactionOverlay}>
                  <LikeButton
                    contentId={video._id}
                    contentType="video"
                    isInitiallyLiked={interactions.liked.includes(video._id)}
                  />
                  <BookmarkButton
                    contentId={video._id}
                    contentType="video"
                    isInitiallyBookmarked={interactions.bookmarked.includes(video._id)}
                  />
                </div>
              )}
              {/* ----------------------------------------------- */}
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{video.title}</h2>
              <p className={styles.cardMeta}>
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.views}>{video.views} views</span>
                <div className={styles.tags}>
                  {video.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
