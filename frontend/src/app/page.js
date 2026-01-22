
import { getLatestContentData } from '@/lib/data';
import HomePageClient from 'components/HomePageClient';

export const dynamic = 'force-dynamic';

async function getLatestContent() {
  try {
    return await getLatestContentData();
  } catch (error) {
    console.error('Failed to fetch latest content:', error);
    return { blogs: [], videos: [] };
  }
}

export default async function HomePage() {
  const { blogs, videos } = await getLatestContent();
  return <HomePageClient blogs={blogs} videos={videos} />;
}

