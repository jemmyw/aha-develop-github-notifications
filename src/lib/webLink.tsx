export function webLink(url: string) {
  return aha.sanitizeUrl(url.replace("api.github", "github"));
}
