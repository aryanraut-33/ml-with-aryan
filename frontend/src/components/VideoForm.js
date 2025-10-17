'use client';

import { useState, useEffect } from 'react';
import styles from './BlogForm.module.css'; // We can reuse the same styles

export default function VideoForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setVideoUrl(initialData.videoUrl || '');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
    }
  }, [isEditing, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoData = {
      title,
      description,
      videoUrl,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    onSubmit(videoData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="title" className={styles.label}>Title</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={styles.input}
      />

      <label htmlFor="description" className={styles.label}>Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className={styles.textarea}
        rows="5"
      />

      <label htmlFor="videoUrl" className={styles.label}>Video URL (e.g., YouTube embed link)</label>
      <input
        id="videoUrl"
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        required
        className={styles.input}
        placeholder="https://www.youtube.com/embed/your_video_id"
      />

      <label htmlFor="tags" className={styles.label}>Tags (comma-separated)</label>
      <input
        id="tags"
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className={styles.input}
      />

      <button type="submit" className={styles.button}>
        {isEditing ? 'Update Video' : 'Create Video'}
      </button>
    </form>
  );
}