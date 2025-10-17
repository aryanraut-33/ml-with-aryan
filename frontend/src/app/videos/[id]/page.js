import api from '../../../lib/api';
import styles from './videoDetail.module.css';

export const dynamic = 'force-dynamic';

async function getVideo(id) {
  try {
    const res = await api.get(`/api/videos/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
}

export default async function VideoDetailPage({ params }) {
  const { id } = params;
  const video = await getVideo(id);

  if (!video) {
    return <p>Video not found.</p>;
  }

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{video.title}</h1>
      <div className={styles.meta}>
        <span>Posted by {video.author.username}</span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        <span>{video.views} views</span>
      </div>

      <div className={styles.videoPlayerWrapper}>
        <iframe
          src={video.videoUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className={styles.description}>
        {video.description.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      
      <div className={styles.tags}>
        {video.tags.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}