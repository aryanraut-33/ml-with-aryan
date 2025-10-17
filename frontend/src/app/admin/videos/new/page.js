'use client';

import { useRouter } from 'next/navigation';
import VideoForm from '../../../../components/VideoForm';
import api from '../../../../lib/api';

export default function NewVideoPage() {
  const router = useRouter();

  const handleSubmit = async (videoData) => {
    try {
      await api.post('/api/videos', videoData);
      alert('Video entry created successfully!');
      router.push('/admin/videos');
    } catch (error) {
      console.error('Failed to create video', error);
      alert('Error creating video entry.');
    }
  };

  return (
    <div>
      <h1>Add New Video</h1>
      <VideoForm onSubmit={handleSubmit} />
    </div>
  );
}