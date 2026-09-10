// One-time (idempotent) seed: populates the products collection with a few
// starter items so the Shop/Inventory pages aren't empty on a fresh database.
// Safe to re-run — it skips products whose SKU already exists.
import 'dotenv/config';
import { connectDB } from './db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

function placeholder(label, accent = '#4be277', secondary = '#adc6ff') {
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
      <text x="80" y="250" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700">${label}</text>
      <text x="80" y="330" fill="#d1d5db" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="400">STAGE Event Production Services</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const STARTER_PRODUCTS = [
  {
    name: 'רמקול JBL V20 מקצועי',
    sku: 'AUDIO-01',
    description: 'מערכת Line Array עוצמתית לאירועים גדולים ופסטיבלים. איכות סאונד קריסטלית.',
    image: placeholder('JBL V20', '#4be277', '#adc6ff'),
    price: 350,
    unit: '/ יום',
    stockTotal: 24,
    category: 'Sound',
    tags: ['רמקול', 'Line Array'],
  },
  {
    name: 'תאורת Beam 230W',
    sku: 'LIGHT-02',
    description: 'פנס חכם עם תנועה מהירה וצבעים עזים למופעי במה.',
    image: placeholder('Beam 230W', '#f59e0b', '#fb7185'),
    price: 180,
    unit: '/ יום',
    stockTotal: 12,
    category: 'Lighting',
    tags: ['תאורה', 'Beam'],
  },
  {
    name: 'מיקרופון Shure QLXD אלחוטי',
    sku: 'MIC-03',
    description: 'סט אלחוטי דיגיטלי מקצועי לשידור נקי מהפרעות.',
    image: placeholder('Shure QLXD', '#22c55e', '#60a5fa'),
    price: 220,
    unit: '/ יום',
    stockTotal: 10,
    category: 'Audio',
    tags: ['מיקרופון', 'אלחוטי'],
  },
];

const STARTER_CATEGORIES = [
  { name: 'Audio', leaves: ['רמקול', 'מיקרופון', 'מגבר'] },
  { name: 'Lighting', leaves: ['תאורה'] },
  { name: 'Accessories', leaves: ['אוזניות'] },
];

async function seed() {
  await connectDB();

  let created = 0;
  for (const item of STARTER_PRODUCTS) {
    const exists = await Product.findOne({ sku: item.sku });
    if (exists) continue;
    await Product.create(item);
    created += 1;
  }
  console.log(`Products: ${created} created, ${STARTER_PRODUCTS.length - created} already existed.`);

  let categoriesCreated = 0;
  for (const item of STARTER_CATEGORIES) {
    const exists = await Category.findOne({ name: item.name });
    if (exists) continue;
    await Category.create({ name: item.name, leaves: item.leaves.map((name) => ({ name })) });
    categoriesCreated += 1;
  }
  console.log(`Categories: ${categoriesCreated} created, ${STARTER_CATEGORIES.length - categoriesCreated} already existed.`);

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
