export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export const TOOL_COLORS: Record<string, string> = {
  ChatGPT: 'bg-emerald-100 text-emerald-700',
  Claude: 'bg-orange-100 text-orange-700',
  Midjourney: 'bg-blue-100 text-blue-700',
  Gemini: 'bg-purple-100 text-purple-700',
  'Stable Diffusion': 'bg-pink-100 text-pink-700',
  'DALL-E': 'bg-cyan-100 text-cyan-700',
  Perplexity: 'bg-teal-100 text-teal-700',
  Copilot: 'bg-indigo-100 text-indigo-700',
  Other: 'bg-gray-100 text-gray-700',
};

export const CATEGORY_ICONS: Record<string, string> = {
  Writing: '✍️',
  Code: '💻',
  Image: '🎨',
  Research: '🔍',
  Productivity: '⚡',
  Marketing: '📢',
  Education: '📚',
  Fun: '🎮',
  Business: '💼',
  Other: '✨',
};
