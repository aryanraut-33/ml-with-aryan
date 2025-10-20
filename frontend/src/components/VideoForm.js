'use client';

import { useState, useEffect } from 'react';
import styles from './BlogForm.module.css'; // ✅ Reuse same styles

export default function VideoForm({ onSubmit, initialData = {}, isEditing = false }) {
  // ---------- STATES ----------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');
  const [authorName, setAuthorName] = useState('Admin'); // ✅ NEW FIELD

  // ---------- INITIAL DATA ----------
  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setVideoUrl(initialData.videoUrl || '');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
      setAuthorName(initialData.authorName || 'Admin'); // ✅ Initialize
    }
  }, [isEditing, initialData]);

  // ---------- SUBMIT HANDLER ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    const videoData = {
      title,
      description,
      videoUrl,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      authorName, // ✅ Include
    };
    onSubmit(videoData);
  };

  // ---------- RENDER ----------
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* ---- TITLE ---- */}
      <label htmlFor="title" className={styles.label}>Title</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={styles.input}
      />

      {/* ---- AUTHOR NAME ---- */}
      <label htmlFor="authorName" className={styles.label}>Author Name</label>
      <input
        id="authorName"
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
        className={styles.input}
        placeholder="e.g., John Doe"
      />

      {/* ---- DESCRIPTION ---- */}
      <label htmlFor="description" className={styles.label}>Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className={styles.textarea}
        rows="5"
        placeholder="Brief summary or context of the video"
      />

      {/* ---- VIDEO URL ---- */}
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

      {/* ---- TAGS ---- */}
      <label htmlFor="tags" className={styles.label}>Tags (comma-separated)</label>
      <input
        id="tags"
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className={styles.input}
        placeholder="education, technology, innovation"
      />

      {/* ---- SUBMIT BUTTON ---- */}
      <button type="submit" className={styles.button}>
        {isEditing ? 'Update Video' : 'Create Video'}
      </button>
    </form>
  );
}
