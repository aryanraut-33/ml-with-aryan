export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image'; // Using Next.js Image for optimization
import api from '../../lib/api';
import { getYoutubeThumbnail } from '../../lib/utils';
import styles from './videos.module.css';

async function getVideos() {
  try {
    const res = await api.get('/api/videos');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return [];
  }
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <div>
      <h1 className={styles.title}>All Video Resources</h1>
      <div className={styles.videoList}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <Link href={`/videos/${video._id}`} key={video._id} className={styles.card}>
              <div className={styles.thumbnail}>
                <Image
                  src={getYoutubeThumbnail(video.videoUrl)}
                  alt={video.title}
                  width={320}
                  height={180}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{video.title}</h2>
                <p className={styles.cardMeta}>
                  Posted on {new Date(video.createdAt).toLocaleDateString()}
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.views}>{video.views} views</span>
                  <div className={styles.tags}>
                    {video.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No videos found. The admin should add one!</p>
        )}
      </div>
    </div>
  );
}