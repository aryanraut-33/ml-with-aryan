import Link from 'next/link';
import Image from 'next/image';
import api from 'lib/api';
import { getYoutubeThumbnail } from 'lib/utils';
import styles from './videos.module.css'; 
import SortToggle from 'components/SortToggle';

export const dynamic = 'force-dynamic';

async function getVideos(sort = 'latest') {
  try {
    const res = await api.get(`/api/videos?sort=${sort}`);
    return res.data;
  } catch (error) { 
    console.error("Failed to fetch videos:", error);
    return []; 
  }
}

export default async function VideosPage({ searchParams }) {
  // --- THIS IS THE FIX ---
  const videos = await getVideos(searchParams.sort || 'latest');
  // -----------------------

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>All Video Resources</h1>
      </div>
      <SortToggle />

      <div className={styles.contentGrid}>
        {videos.map((video) => (
          <Link href={`/videos/${video._id}`} key={video._id} className={styles.card}>
            <div className={styles.cardImage}>
              {video.videoUrl && (
                <Image src={getYoutubeThumbnail(video.videoUrl)} alt={video.title} fill style={{ objectFit: 'cover' }} />
              )}
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{video.title}</h2>
              <p className={styles.cardMeta}>
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.views}>{video.views} views</span>
                <div className={styles.tags}>
                  {video.tags?.slice(0, 2).map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}