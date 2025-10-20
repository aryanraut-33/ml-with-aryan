import api from 'lib/api';
import BlogDetailClient from 'components/BlogDetailClient';

export const dynamic = 'force-dynamic';

async function getBlog(id) {
  try {
    const res = await api.get(`/api/blogs/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch blog with ID ${id}:`, error);
    return null;
  }
}

export default async function BlogDetailPage({ params }) {
  const blog = await getBlog(params.id);
  return <BlogDetailClient blog={blog} />;
}