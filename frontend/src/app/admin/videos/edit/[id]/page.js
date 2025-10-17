'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import VideoForm from '../../../../../components/VideoForm';
import api from '../../../../../lib/api';

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchVideo = async () => {
        try {
          const res = await api.get(`/api/videos/${id}`);
          setVideo(res.data);
        } catch (error) {
          console.error('Failed to fetch video', error);
        } finally {
          setLoading(false);
        }
      };
      fetchVideo();
    }
  }, [id]);

  const handleSubmit = async (videoData) => {
    try {
      await api.put(`/api/videos/${id}`, videoData);
      alert('Video updated successfully!');
      router.push('/admin/videos');
    } catch (error) {
      console.error('Failed to update video', error);
      alert('Error updating video entry.');
    }
  };

  if (loading) {
    return <p>Loading video data...</p>;
  }

  if (!video) {
    return <p>Could not load video data.</p>;
  }

  return (
    <div>
      <h1>Edit Video</h1>
      <VideoForm onSubmit={handleSubmit} initialData={video} isEditing={true} />
    </div>
  );
}