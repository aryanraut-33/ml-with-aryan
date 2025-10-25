'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook that tracks whether a media query matches.
 * @param {string} query - The CSS media query to match (e.g., '(max-width: 768px)').
 * @returns {boolean} - True if the query matches, false otherwise.
 */
export function useMediaQuery(query) {
  // Initialize state, ensuring it's only read on the client
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // This code only runs in the browser
    const media = window.matchMedia(query);
    
    // Update state if the initial match is different
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    
    // Use the modern addEventListener syntax
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}