type PlaceholderImageOptions = {
  accent?: string;
  secondary?: string;
};

export function makePlaceholderImage(label: string, options: PlaceholderImageOptions = {}) {
  const accent = options.accent ?? '#4be277';
  const secondary = options.secondary ?? '#adc6ff';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="55%" stop-color="#111827" />
          <stop offset="100%" stop-color="#030712" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" />
      <circle cx="960" cy="180" r="180" fill="${accent}" opacity="0.16" />
      <circle cx="180" cy="640" r="140" fill="${secondary}" opacity="0.12" />
      <rect x="80" y="560" width="1040" height="120" rx="30" fill="#ffffff" opacity="0.06" />
      <text x="80" y="250" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700">${label}</text>
      <text x="80" y="330" fill="#d1d5db" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="400">STAGE Event Production Services</text>
      <rect x="80" y="390" width="240" height="14" rx="7" fill="${accent}" />
      <rect x="80" y="430" width="360" height="14" rx="7" fill="${secondary}" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}