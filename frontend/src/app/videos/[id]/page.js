import api from '../../../lib/api';
import styles from './videoDetail.module.css';
import { convertToEmbedUrl } from '../../../lib/utils';

export const dynamic = 'force-dynamic';

async function getVideo(id) {
  try {
    const res = await api.get(`/api/videos/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch video with ID ${id}:`, error);
    return null;
  }
}

export default async function VideoDetailPage({ params }) {
  const video = await getVideo(params.id);

  if (!video) {
    return <p>Video not found.</p>;
  }
  
  const embedUrl = convertToEmbedUrl(video.videoUrl);

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{video.title}</h1>
      <div className={styles.meta}>
        {/* --- THIS IS THE UPDATED LINE --- */}
        <span>Posted by {video.authorName || video.author?.username || 'Admin'}</span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        <span>{video.views} views</span>
      </div>

      <div className={styles.videoPlayerWrapper}>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Invalid video URL provided.</p>
        )}
      </div>

      <div className={styles.description}>
        {video.description.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      
      <div className={styles.tags}>
        {video.tags?.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}