export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/))([\w-]+)/,
  )
  return match ? match[1] : null
}
