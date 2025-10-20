'use client';

import { useState } from 'react';
import api from '../lib/api';
import styles from './ImageUploader.module.css';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadedUrl(''); // Reset on new file selection
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setUploadedUrl(res.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`![alt text](${uploadedUrl})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className={styles.uploaderContainer}>
      <h3 className={styles.title}>Upload an Image for Your Blog Post</h3>
      <div className={styles.controls}>
        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.input} />
        <button onClick={handleUpload} disabled={uploading || !file} className={styles.button}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {uploadedUrl && (
        <div className={styles.result}>
          <p>Image uploaded! Here is your Markdown link:</p>
          <div className={styles.urlContainer}>
            <input type="text" readOnly value={`![alt text](${uploadedUrl})`} className={styles.urlInput} />
            <button onClick={handleCopy} className={styles.copyButton}>
              {copied ? <FiCheck /> : <FiCopy />}
            </button>
          </div>
          <p className={styles.instruction}>Copy this and paste it into the main content below where you want the image to appear.</p>
        </div>
      )}
    </div>
  );
}