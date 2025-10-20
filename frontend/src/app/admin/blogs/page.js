'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from 'lib/api';
import styles from './manage.module.css';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/blogs');
      setBlogs(res.data);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.delete(`/api/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        alert('Error deleting blog post.');
      }
    }
  };

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Manage Blogs</h1>
        <Link href="/admin/blogs/new" className={styles.addButton}>
          Add New Blog
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
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>{blog.views}</td>
              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td className={styles.actions}>
                <Link href={`/admin/blogs/edit/${blog._id}`} className={styles.editButton}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(blog._id)} className={styles.deleteButton}>
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