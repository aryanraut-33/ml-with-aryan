'use client';

import { useRouter } from 'next/navigation';
import BlogForm from '../../../../components/BlogForm';
import api from '../../../../lib/api';

export default function NewBlogPage() {
  const router = useRouter();

  const handleSubmit = async (blogData) => {
    try {
      await api.post('/api/blogs', blogData);
      alert('Blog created successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Failed to create blog', error);
      alert('Error creating blog post.');
    }
  };

  return (
    <div>
      <h1>Add New Blog</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}