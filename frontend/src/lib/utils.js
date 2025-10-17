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