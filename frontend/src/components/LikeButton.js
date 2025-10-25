'use client';

import { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import api from 'lib/api';
import { useAuth } from 'context/AuthContext';

export default function LikeButton({ contentId, contentType, isInitiallyLiked }) {
  const [liked, setLiked] = useState(isInitiallyLiked);
  const { user } = useAuth();

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert('Please log in to like content.');

    setLiked(!liked);
    try {
      await api.post(`/api/interactions/${contentId}/like`, { contentType });
    } catch (error) {
      setLiked(!liked); // Revert on error
    }
  };

  return (
    <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#ff4d4d' : 'inherit' }}>
      <FiHeart size={20} fill={liked ? '#ff4d4d' : 'none'} />
    </button>
  );
}