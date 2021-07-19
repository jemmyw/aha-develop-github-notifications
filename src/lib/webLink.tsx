export function webLink(url: string) {
  return aha.sanitizeUrl(
    url
      .replace("api.github", "github")
      .replace("/repos/", "/")
      .replace("/pulls/", "/pull/")
  );
}
