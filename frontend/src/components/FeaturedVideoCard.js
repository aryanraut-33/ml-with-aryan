import Link from 'next/link';
import Image from 'next/image';
import { FiArrowUpRight } from 'react-icons/fi';
import styles from './FeaturedBlogCard.module.css'; // We can reuse the same styles!
import { getYoutubeThumbnail } from 'lib/utils'; // Import the video thumbnail helper

export default function FeaturedVideoCard({ video }) {
  return (
    <Link href={`/videos/${video._id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {video.videoUrl && (
          <Image src={getYoutubeThumbnail(video.videoUrl)} alt={video.title} fill style={{ objectFit: 'cover' }} />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <div className={styles.tags}>
            {video.tags?.slice(0, 2).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
          </div>
        </div>
        <h3 className={styles.title}>{video.title}</h3>
        <p className={styles.description}>{video.description}</p>
        
        <div className={styles.footer}>
          <div className={styles.authorInfo}>
            <div className={styles.authorText}>
              <span className={styles.authorName}>By {video.authorName || video.author?.username || 'Admin'}</span>
              <span className={styles.date}>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <span className={styles.readMore}>
            Watch Video <FiArrowUpRight />
          </span>
        </div>
      </div>
    </Link>
  );
}