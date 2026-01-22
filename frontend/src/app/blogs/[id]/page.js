import api from 'lib/api';
import BlogDetailClient from 'components/BlogDetailClient';

export const dynamic = 'force-dynamic';

import { getBlogById } from '@/lib/data';

async function getBlog(id) {
  try {
    return await getBlogById(id);
  } catch (error) {
    console.error(`Failed to fetch blog with ID ${id}:`, error);
    return null;
  }
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);
  return <BlogDetailClient blog={blog} />;
}