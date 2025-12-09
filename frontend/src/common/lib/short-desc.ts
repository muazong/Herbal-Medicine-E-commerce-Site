export function shortDesc(text: string, textLength: number = 12) {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);

  if (words.length > 1) {
    return words.length > textLength
      ? words.slice(0, textLength).join(' ') + '...'
      : trimmed;
  }

  return trimmed.length > textLength
    ? trimmed.slice(0, textLength) + '...'
    : trimmed;
}
