/** Extract YouTube video ID from various URL formats */
export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? match[1] : null;
}

/** Convert a YouTube watch/share URL to an embeddable URL */
export function toYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeId(url);
  if (id) return `https://www.youtube.com/embed/${id}`;
  return url;
}
