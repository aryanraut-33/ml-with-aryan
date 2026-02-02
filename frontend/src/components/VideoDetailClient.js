'use client';

import { useState, useEffect } from 'react';
import styles from 'app/videos/[id]/videoDetail.module.css';
import { useAuth } from 'context/AuthContext';
import api from 'lib/api';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import ShareButton from './ShareButton';
import { convertToEmbedUrl } from 'lib/utils';
import BlockRenderer from './BlockRenderer';

export default function VideoDetailClient({ video }) {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState({ liked: false, bookmarked: false });

  useEffect(() => {
    if (user && video) {
      const fetchInteractions = async () => {
        try {
          const res = await api.post('/api/users/interactions', { contentIds: [video._id] });
          setInteractions({
            liked: res.data.liked.includes(video._id),
            bookmarked: res.data.bookmarked.includes(video._id),
          });
        } catch (error) {
          console.error("Failed to fetch interactions for video", error);
        }
      };
      fetchInteractions();
    }
  }, [user, video]);

  // --- THIS IS THE FIX ---
  // Instead of checking for a 'length', we simply check if the 'video' object exists.
  if (!video) {
    return <p>Video not found.</p>;
  }
  // -----------------------

  const embedUrl = convertToEmbedUrl(video.videoUrl);

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{video.title}</h1>
      <div className={styles.meta}>
        <span>Posted by {video.authorName || 'Admin'}</span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        <span>{video.views} views</span>

        <div className={styles.interactionContainer}>
          {/* {user && (
            <>
              <LikeButton contentId={video._id} contentType="video" isInitiallyLiked={interactions.liked} />
              <BookmarkButton contentId={video._id} contentType="video" isInitiallyBookmarked={interactions.bookmarked} />
            </>
          )} */}
          <ShareButton />
        </div>
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

      {video.blocks && video.blocks.length > 0 && (
        <div className={styles.additionalContent}>
          <BlockRenderer blocks={video.blocks} styles={styles} />
        </div>
      )}

      <div className={styles.tags}>
        {video.tags?.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
        -</div>
    </article>
  );
}