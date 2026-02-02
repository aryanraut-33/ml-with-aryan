'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './BlogForm.module.css';
import DynamicBlockEditor from './DynamicBlockEditor';

export default function BlogForm({ onSubmit, initialData = null, isEditing = false }) {
  // ---------- STATES ----------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Content is now derived from blocks, but we keep old 'content' field for migration or simple text
  // Actually, let's switch to blocks.
  const [blocks, setBlocks] = useState([]);

  const [tags, setTags] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [authorName, setAuthorName] = useState('Admin');
  const [projectLink, setProjectLink] = useState('');

  // ---------- INITIAL DATA ----------
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
      setThumbnailPreview(initialData.thumbnailUrl || '');
      setAuthorName(initialData.authorName || 'Admin');
      setProjectLink(initialData.projectLink || '');

      if (initialData.blocks && initialData.blocks.length > 0) {
        setBlocks(initialData.blocks);
      } else if (initialData.content) {
        // Backward compatibility: Convert legacy content string to a text block
        setBlocks([{ id: 'legacy-1', type: 'text', content: initialData.content }]);
      } else {
        setBlocks([{ id: 'init-1', type: 'text', content: '' }]);
      }
    }
  }, [initialData]);

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
      // flatten blocks to content string for legacy support if needed, or just send blocks
      // We will send blocks. The API/Model should handle it.
      // We also send 'content' as a fallback string (concatenated text) for SEO/search if needed
      content: blocks.map(b => typeof b.content === 'string' ? b.content : '').join('\n'),
      blocks,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      thumbnailFile,
      authorName,
      projectLink,
    };
    onSubmit(blogData);
  };

  // ---------- RENDER ----------
  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* LEFT COLUMN: Main Editing Area */}
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
          <label htmlFor="description" className={styles.label}>Short Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.textarea}
            rows="3"
            placeholder="A brief summary..."
          />
        </div>

        {/* ---- DYNAMIC CONTENT BLOCKS ---- */}
        <div>
          <label className={styles.label} style={{ marginBottom: '1rem', display: 'block' }}>Content</label>
          <DynamicBlockEditor blocks={blocks} setBlocks={setBlocks} />
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar (Meta & Media) */}
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
          <label htmlFor="thumbnail" className={styles.label}>Thumbnail</label>

          {thumbnailPreview && (
            <div className={styles.preview} style={{ marginBottom: '1rem' }}>
              <Image
                src={thumbnailPreview}
                alt="Preview"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          <input
            id="thumbnail"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className={styles.input}
            style={{ fontSize: '0.8rem' }}
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
            placeholder="tech, ai, coding"
          />
          <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>Comma separated</small>
        </div>

        <div style={{ background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <label htmlFor="projectLink" className={styles.label}>Project Link (Optional)</label>
          <input
            id="projectLink"
            type="text"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            className={styles.input}
            placeholder="https://..."
          />
        </div>

        {/* Sticky Submit Button Strategy: Place it here or at bottom? 
              Let's put main submit at bottom of form spanning full width, or here in sidebar?
              Sidebar is good for "Publish" button. 
           */}
        <button type="submit" className={styles.button} style={{ marginTop: '0' }}>
          {isEditing ? 'Update Post' : 'Publish Post'}
        </button>

      </div>
    </form>
  );
}
