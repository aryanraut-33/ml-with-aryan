'use client';

import { useState } from 'react';
import { FiBookmark } from 'react-icons/fi';
import api from 'lib/api';
import { useAuth } from 'context/AuthContext';

export default function BookmarkButton({ contentId, contentType, isInitiallyBookmarked }) {
  const [bookmarked, setBookmarked] = useState(isInitiallyBookmarked);
  const { user } = useAuth();

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert('Please log in to bookmark content.');

    setBookmarked(!bookmarked);
    try {
      await api.post(`/api/interactions/${contentId}/bookmark`, { contentType });
    } catch (error) {
      setBookmarked(!bookmarked);
    }
  };

  return (
    <button onClick={handleBookmark} style={{ background: 'none', border: 'none', cursor: 'pointer', color: bookmarked ? 'var(--accent-blue)' : 'inherit' }}>
      <FiBookmark size={20} fill={bookmarked ? 'var(--accent-blue)' : 'none'} />
    </button>
  );
}