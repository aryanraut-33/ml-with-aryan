import Link from 'next/link';
import Image from 'next/image';
import { getYoutubeThumbnail } from 'lib/utils';
import styles from './BookmarkCard.module.css';
import { FiArrowUpRight } from 'react-icons/fi';

export default function BookmarkCard({ item }) {
  // Determine if the item is a blog or a video
  const isBlog = !!item.content;
  const url = isBlog ? `/blogs/${item._id}` : `/videos/${item._id}`;
  const imageUrl = isBlog ? item.thumbnailUrl : getYoutubeThumbnail(item.videoUrl);

  return (
    <Link href={url} className={styles.card}>
      <div className={styles.imageContainer}>
        {imageUrl && (
          <Image src={imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.title}</h3>
        <div className={styles.footer}>
          <div className={styles.tags}>
            {item.tags?.slice(0, 3).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
          </div>
          <span className={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <FiArrowUpRight className={styles.arrowIcon} />
    </Link>
  );
}