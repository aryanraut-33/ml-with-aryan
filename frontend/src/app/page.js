import api from 'lib/api';
import HomePageClient from 'components/HomePageClient';

export const dynamic = 'force-dynamic';

async function getLatestContent() {
  try {
    const res = await api.get('/api/content/latest');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch latest content:', error);
    return { blogs: [], videos: [] };
  }
}

export default async function HomePage() {
  const { blogs, videos } = await getLatestContent();
  return <HomePageClient blogs={blogs} videos={videos} />;
}
