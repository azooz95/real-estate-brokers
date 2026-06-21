export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export function sarShort(amount: number): string {
  if (amount >= 1_000_000) return `SAR ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `SAR ${(amount / 1_000).toFixed(1)}K`;
  return `SAR ${amount}`;
}
