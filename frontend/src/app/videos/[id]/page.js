// This is now a pure Server Component for data fetching.
import api from 'lib/api';
import VideoDetailClient from 'components/VideoDetailClient'; // Import our new client component

export const dynamic = 'force-dynamic';

async function getVideo(id) {
  try {
    const res = await api.get(`/api/videos/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch video with ID ${id}:`, error);
    return null;
  }
}

export default async function VideoDetailPage({ params }) {
  // 1. Fetch data on the server.
  const video = await getVideo(params.id);

  // 2. Pass the data as a prop to the client component for rendering.
  return <VideoDetailClient video={video} />;
}