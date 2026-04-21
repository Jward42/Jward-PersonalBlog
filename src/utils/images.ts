
function isCloudinaryUrl(url: string) {
  return url.includes('res.cloudinary.com') && url.includes('/upload/');
}

export function transformCloudinaryUrl(url: string, width = 800): string {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const uploadMatch = url.match(/\/upload\/([^/]+)\//);

  if (uploadMatch && (uploadMatch[1].includes('f_auto') || uploadMatch[1].includes('w_'))) {
    url = url.replace(`/upload/${uploadMatch[1]}/`, '/upload/');
  }

  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
