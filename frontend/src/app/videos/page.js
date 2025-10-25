import { Suspense } from 'react';
import VideoPageWrapper from './VideoPageWrapper';

export default function VideosPage() {
  return (
    <Suspense fallback={<p style={{textAlign: 'center', marginTop: '4rem'}}>Loading...</p>}>
      <VideoPageWrapper />
    </Suspense>
  );
}