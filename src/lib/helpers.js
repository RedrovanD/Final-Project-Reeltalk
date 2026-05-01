export const flags = ['All', 'Question', 'Catch Report', 'Gear Review', 'Tip', 'Opinion'];
export const waterTypes = ['Pond', 'Lake', 'River', 'Creek', 'Ocean', 'Pier', 'Other'];

export function formatDate(date) {
  return new Date(date).toLocaleString();
}

export function getYouTubeEmbedUrl(url = '') {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }

    return '';
  } catch (err) {
    console.error('Invalid YouTube URL:', err);
    return '';
  }
}

export function getUserId() {
  let userId = localStorage.getItem('reeltalk-user-id');

  if (!userId) {
    userId = `angler-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('reeltalk-user-id', userId);
  }

  return userId;
}