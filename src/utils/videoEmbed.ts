export function getVideoEmbedLink(url: string): string {
  if (!url) return '';
  const trimmedUrl = url.trim();

  if (
    trimmedUrl.toLowerCase().includes('drive.google.com') ||
    trimmedUrl.toLowerCase().includes('docs.google.com')
  ) {
    const drivePathMatch = trimmedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (drivePathMatch?.[1]) {
      return `https://drive.google.com/file/d/${drivePathMatch[1]}/preview`;
    }

    try {
      const parsed = new URL(trimmedUrl);
      const fileId = parsed.searchParams.get('id');
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    } catch {
      // ignore invalid URL
    }
  }

  const youtubePatterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of youtubePatterns) {
    const match = trimmedUrl.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&origin=${window.location.origin}`;
    }
  }

  const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = trimmedUrl.match(youtubeRegExp);
  if (ytMatch?.[2]?.length === 11) {
    return `https://www.youtube.com/embed/${ytMatch[2]}?autoplay=1&origin=${window.location.origin}`;
  }

  if (trimmedUrl.includes('/embed/') || trimmedUrl.includes('/preview')) {
    return trimmedUrl;
  }

  return '';
}

export function canPlayVideo(url: string): boolean {
  return getVideoEmbedLink(url).length > 0;
}
