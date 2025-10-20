export function getYoutubeThumbnail(url) {
    if (!url) {
      return ''; // Return empty string if no URL is provided
    }
  
    let videoId = '';
    // Regex to find the video ID from various YouTube URL formats
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = url.match(regex);
  
    if (match) {
      videoId = match[1];
    } else {
      // Fallback for simple embed URLs that might not match
      const urlParts = url.split('/');
      videoId = urlParts[urlParts.length - 1];
    }
  
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    
    return ''; // Return empty if no ID could be found
  }

export function convertToEmbedUrl(url) {
    if (!url) return '';
  
    let videoId = '';
    // Regular watch URL
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    } 
    // Shortened youtu.be URL
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } 
    // Already an embed URL
    else if (url.includes('/embed/')) {
      return url; // It's already in the correct format
    }
  
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  
    // Fallback if no valid format is found
    return '';
  }