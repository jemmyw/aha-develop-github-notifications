export function repoFromUrl(url: string): [string, string] | [] {
  const match = url.match(/\/repos\/([^\/]+)\/([^\/]+)\//);
  if (match) {
    return [match[1], match[2]];
  }

  return [];
}
