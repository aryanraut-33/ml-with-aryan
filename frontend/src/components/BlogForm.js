'use client';

import { useState, useEffect } from 'react';
import styles from './BlogForm.module.css';

export default function BlogForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
    }
  }, [isEditing, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const blogData = {
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Split string into an array
    };
    onSubmit(blogData);
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

      <label htmlFor="content" className={styles.label}>Content</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className={styles.textarea}
        rows="15"
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
        {isEditing ? 'Update Blog' : 'Create Blog'}
      </button>
    </form>
  );
}