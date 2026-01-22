'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './BlogForm.module.css';

export default function BlogForm({ onSubmit, initialData = {}, isEditing = false }) {
  // ---------- STATES ----------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [authorName, setAuthorName] = useState('Admin'); // ✅ NEW FIELD

  // ---------- INITIAL DATA ----------
  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setContent(initialData.content || '');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
      setThumbnailPreview(initialData.thumbnailUrl || '');
      setAuthorName(initialData.authorName || 'Admin'); // ✅ Initialize
    }
  }, [isEditing, initialData]);

  // ---------- FILE HANDLER ----------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // ---------- SUBMIT HANDLER ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = {
      title,
      description,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      thumbnailFile,
      authorName, // ✅ Include
    };
    onSubmit(blogData);
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

      {/* ---- THUMBNAIL UPLOAD ---- */}
      <label htmlFor="thumbnail" className={styles.label}>Thumbnail Image</label>
      <input
        id="thumbnail"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className={styles.input}
      />

      {thumbnailPreview && (
        <div className={styles.preview}>
          <Image
            src={thumbnailPreview}
            alt="Thumbnail preview"
            width={200}
            height={120}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      {/* ---- SHORT DESCRIPTION ---- */}
      <label htmlFor="description" className={styles.label}>Short Description (for cards)</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className={styles.textarea}
        rows="3"
        maxLength="200"
        placeholder="A brief, engaging summary of the article."
      />

      {/* ---- MAIN CONTENT ---- */}
      <label htmlFor="content" className={styles.label}>
        Content
        <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '10px', fontWeight: 'normal' }}>
          (Supports Markdown & LaTeX: $E=mc^2$)
        </span>
      </label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className={styles.textarea}
        rows="15"
      />

      {/* ---- TAGS ---- */}
      <label htmlFor="tags" className={styles.label}>Tags (comma-separated)</label>
      <input
        id="tags"
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className={styles.input}
      />

      {/* ---- SUBMIT BUTTON ---- */}
      <button type="submit" className={styles.button}>
        {isEditing ? 'Update Blog' : 'Create Blog'}
      </button>
    </form>
  );
}
