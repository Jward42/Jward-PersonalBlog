
export function transformCloudinaryUrl(url: string, width: number = 800): string {
  const uploadMatch = url.match(/\/upload\/([^\/]+)\//);
  if (uploadMatch && (uploadMatch[1].includes('f_auto') || uploadMatch[1].includes('w_'))) {
    url = url.replace(`/upload/${uploadMatch[1]}/`, '/upload/');
  }
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
