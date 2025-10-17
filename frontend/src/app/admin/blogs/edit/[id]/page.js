'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogForm from '../../../../../components/BlogForm';
import api from '../../../../../lib/api';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const res = await api.get(`/api/blogs/${id}`);
          setBlog(res.data);
        } catch (error) {
          console.error('Failed to fetch blog', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleSubmit = async (blogData) => {
    try {
      await api.put(`/api/blogs/${id}`, blogData);
      alert('Blog updated successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Failed to update blog', error);
      alert('Error updating blog post.');
    }
  };

  if (loading) {
    return <p>Loading blog data...</p>;
  }

  if (!blog) {
    return <p>Could not load blog data.</p>;
  }

  return (
    <div>
      <h1>Edit Blog</h1>
      <BlogForm onSubmit={handleSubmit} initialData={blog} isEditing={true} />
    </div>
  );
}