import { makePlaceholderImage } from '../../utils/placeholderImage';

export const SERVICES = [
  {
    id: 'audio',
    title: 'מערכות סאונד והגברה',
    description: 'תכנון וביצוע של מערכות Line Array להופעות, כנסים ואירועי חוץ במפרטים הטכניים הגבוהים ביותר.',
    image: makePlaceholderImage('Audio Systems', { accent: '#4be277', secondary: '#adc6ff' }),
  },
  {
    id: 'screens',
    title: 'מסכי LED ווידאו',
    description: 'פתרונות הקרנה ומסכי לד באיכות P2.6 לחוויית צפייה מושלמת.',
    image: makePlaceholderImage('LED Visuals', { accent: '#adc6ff', secondary: '#22c55e' }),
  },
  {
    id: 'lighting',
    title: 'עיצוב תאורה',
    description: 'תאורה חכמה ומתוכנתת המעניקה עומק ודרמה לכל אירוע.',
    image: makePlaceholderImage('Lighting Design', { accent: '#f59e0b', secondary: '#fb7185' }),
  },
];
