const ALLOWED_EMBED_HOSTS = new Set([
  "www.figma.com",
  "figma.com",
  "embed.figma.com",
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
]);

export function safeEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    if (!ALLOWED_EMBED_HOSTS.has(parsed.hostname)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
