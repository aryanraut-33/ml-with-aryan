'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogForm from 'components/BlogForm';
import api from 'lib/api';
import ImageUploader from 'components/ImageUploader';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const res = await api.get(`/api/blogs/${id}`);
          setBlog(res.data);
        } catch (error) {
          console.error('Failed to fetch blog', error);
          alert('Could not load blog data. It might have been deleted.');
          router.push('/admin/blogs');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, router]);

  const handleSubmit = async (blogData) => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Start with the existing thumbnail URL as a fallback
    let thumbnailUrl = blog.thumbnailUrl;

    try {
      // Step 1: If a *new* thumbnail file was selected, upload it and get the new URL
      if (blogData.thumbnailFile) {
        const formData = new FormData();
        formData.append('image', blogData.thumbnailFile);

        const uploadRes = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        thumbnailUrl = uploadRes.data.url; // Overwrite with the new URL
      }

      // Step 2: Prepare the final blog data object for the update
      const finalBlogData = {
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        tags: blogData.tags,
        authorName: blogData.authorName,
        thumbnailUrl: thumbnailUrl,
      };

      // Step 3: Update the blog post with the final data
      await api.put(`/api/blogs/${id}`, finalBlogData);
      
      alert('Blog updated successfully!');
      router.push('/admin/blogs');

    } catch (error) {
      console.error('Failed to update blog:', error.response?.data || error);
      alert('Error updating blog post. Please check the console for details.');
      setIsSubmitting(false); // Re-enable the form on error
    }
  };

  if (loading) return <p>Loading blog data...</p>;
  if (!blog) return <p>Could not find blog data to edit.</p>;

  return (
    <div>
      <h1>Edit Blog</h1>
      
      {/* Utility for uploading images to be used inside the blog content */}
      <ImageUploader />
      
      {/* The main form, pre-filled with existing blog data */}
      <BlogForm onSubmit={handleSubmit} initialData={blog} isEditing={true} />

      {/* Loading indicator during submission */}
      {isSubmitting && <p style={{ marginTop: '1rem', color: 'var(--accent-blue)' }}>Updating post, please wait...</p>}
    </div>
  );
}