import Link from 'next/link';
import Image from 'next/image';
import { getYoutubeThumbnail } from '../lib/utils';
import styles from './BlogCard.module.css'; // Using new VideoCard styles

export default function VideoGridCard({ video }) {
  return (
    <Link href={`/videos/${video._id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {video.videoUrl && (
          <Image 
            src={getYoutubeThumbnail(video.videoUrl)} 
            alt={video.title} 
            fill 
            style={{ objectFit: 'cover' }} 
          />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.tags}>
          {video.tags?.slice(0, 2).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>
        <h4 className={styles.title}>{video.title}</h4>
        <p className={styles.description}>{video.description}</p>
        <div className={styles.authorInfo}>
          <div className={styles.authorText}>
            <span className={styles.authorName}>{video.authorName || video.author?.username || 'Admin'}</span>
            <span className={styles.date}>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}