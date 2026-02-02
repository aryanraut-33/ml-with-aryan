'use client';

import { useState, useEffect } from 'react';
import styles from './BlogForm.module.css'; // ✅ Reuse same styles
import DynamicBlockEditor from './DynamicBlockEditor';

export default function VideoForm({ onSubmit, initialData = null, isEditing = false }) {
  // ---------- STATES ----------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');
  const [authorName, setAuthorName] = useState('Admin');

  // ---------- BLOCKS ----------
  const [blocks, setBlocks] = useState([]);

  // ---------- INITIAL DATA ----------
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setVideoUrl(initialData.videoUrl || '');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
      setAuthorName(initialData.authorName || 'Admin');

      if (initialData.blocks && initialData.blocks.length > 0) {
        setBlocks(initialData.blocks);
      } else {
        // Initialize with empty array or default block
        setBlocks([]);
      }
    }
  }, [initialData]);

  // ---------- SUBMIT HANDLER ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    const videoData = {
      title,
      description,
      videoUrl,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      authorName,
      blocks, // ✅ Send blocks
    };
    onSubmit(videoData);
  };

  // ---------- RENDER ----------
  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* LEFT COLUMN: Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
          />
        </div>

        <div>
          <label htmlFor="videoUrl" className={styles.label}>Video URL</label>
          <input
            id="videoUrl"
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            className={styles.input}
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>

        <div>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.textarea}
            rows="5"
            placeholder="Brief summary..."
          />
        </div>

        {/* ---- DYNAMIC CONTENT BLOCKS ---- */}
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Additional Content</h3>
          <DynamicBlockEditor blocks={blocks} setBlocks={setBlocks} />
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar (Meta) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        <div style={{ background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <label htmlFor="authorName" className={styles.label}>Author</label>
          <input
            id="authorName"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div style={{ background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <label htmlFor="tags" className={styles.label}>Tags</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={styles.input}
            placeholder="education, tech"
          />
          <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>Comma separated</small>
        </div>

        <button type="submit" className={styles.button} style={{ marginTop: '0' }}>
          {isEditing ? 'Update Video' : 'Publish Video'}
        </button>

      </div>
    </form>
  );
}
