'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BlogForm from 'components/BlogForm';
import api from 'lib/api';
import ImageUploader from 'components/ImageUploader';

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (blogData) => {
    // Prevent multiple submissions while one is in progress
    if (isSubmitting) return;
    setIsSubmitting(true);

    let thumbnailUrl = '';

    try {
      // Step 1: If a thumbnail file is selected, upload it first to get the URL
      if (blogData.thumbnailFile) {
        const formData = new FormData();
        formData.append('image', blogData.thumbnailFile);

        const uploadRes = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        thumbnailUrl = uploadRes.data.url;
      }

      // Step 2: Prepare the final blog data object with all fields
      const finalBlogData = {
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        tags: blogData.tags,
        authorName: blogData.authorName,
        thumbnailUrl: thumbnailUrl,
        projectLink: blogData.projectLink,
      };

      // Step 3: Create the blog post with the final data
      await api.post('/api/blogs', finalBlogData);

      alert('Blog created successfully!');
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Failed to create blog:', error.response?.data || error);
      alert('Error creating blog post. Please check the console for details.');
      setIsSubmitting(false); // Re-enable the form on error
    }
  };

  return (
    <div>
      <h1>Add New Blog</h1>

      {/* Utility for uploading images to be used inside the blog content */}
      <ImageUploader />

      {/* The main form for creating the blog post */}
      <BlogForm onSubmit={handleSubmit} />

      {/* Loading indicator during submission */}
      {isSubmitting && <p style={{ marginTop: '1rem', color: 'var(--accent-blue)' }}>Creating post, please wait...</p>}
    </div>
  );
}