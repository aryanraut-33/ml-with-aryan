import { Suspense } from 'react';
import BlogPageWrapper from './BlogPageWrapper'; // <-- Import the new wrapper

// This is a clean Server Component.
export default function BlogsPage() {
  return (
    <Suspense fallback={<p style={{textAlign: 'center', marginTop: '4rem'}}>Loading...</p>}>
      <BlogPageWrapper />
    </Suspense>
  );
}