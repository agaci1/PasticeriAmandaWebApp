import API_BASE from "./api"

export function resolveFeedMediaUrl(url: string) {
  return url.startsWith("/uploads/") ? `${API_BASE}${url}` : url
}

export function isEmbedVideoUrl(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
}
