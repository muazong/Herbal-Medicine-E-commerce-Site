export function shortDesc(text: string, textLength: number = 12) {
  const words = text.trim().split(/\s+/);
  if (words.length > textLength) {
    return words.slice(0, textLength).join(' ') + '...';
  }
  return text;
}
