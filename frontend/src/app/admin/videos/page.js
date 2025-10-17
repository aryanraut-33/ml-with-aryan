'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';
import styles from '../blogs/manage.module.css'; // Reusing blog management styles

export default function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/api/videos');
      setVideos(res.data);
    } catch (error) {
      console.error('Failed to fetch videos', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video entry?')) {
      try {
        await api.delete(`/api/videos/${id}`);
        fetchVideos(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete video', error);
        alert('Error deleting video entry.');
      }
    }
  };

  if (loading) return <p>Loading videos...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Manage Videos</h1>
        <Link href="/admin/videos/new" className={styles.addButton}>
          Add New Video
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Views</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video._id}>
              <td>{video.title}</td>
              <td>{video.views}</td>
              <td>{new Date(video.createdAt).toLocaleDateString()}</td>
              <td className={styles.actions}>
                <Link href={`/admin/videos/edit/${video._id}`} className={styles.editButton}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(video._id)} className={styles.deleteButton}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}