import type { Order, OrderStatus } from '../types';

const PRODUCTS = [
  'MacBook Pro 16"',
  'iPhone 15 Pro',
  'AirPods Pro',
  'iPad Air',
  'Magic Keyboard',
  'Studio Display',
  'Logitech MX Master',
  'Dell UltraSharp 27"',
  'Herman Miller Chair',
  'Standing Desk',
  'Notion Plus Plan',
  'Linear Standard',
];

const STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const FIRST = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara'];
const LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson'];

function seeded(n: number, seed: number): number {
  const x = Math.sin(seed + n * 999) * 10000;
  return x - Math.floor(x);
}

export function generateOrders(count = 48): Order[] {
  const orders: Order[] = [];
  for (let i = 1; i <= count; i++) {
    const fi = Math.floor(seeded(i, 1) * FIRST.length);
    const li = Math.floor(seeded(i, 2) * LAST.length);
    const qty = 1 + Math.floor(seeded(i, 3) * 5);
    const price = 49 + Math.floor(seeded(i, 4) * 2400);
    const daysAgo = Math.floor(seeded(i, 5) * 45);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    orders.push({
      id: 1000 + i,
      customerName: `${FIRST[fi]} ${LAST[li]}`,
      customerEmail: `${FIRST[fi].toLowerCase()}.${LAST[li].toLowerCase()}@example.com`,
      productName: PRODUCTS[Math.floor(seeded(i, 6) * PRODUCTS.length)],
      quantity: qty,
      price,
      total: qty * price,
      status: STATUSES[Math.floor(seeded(i, 7) * STATUSES.length)],
      date: date.toISOString(),
    });
  }
  return orders.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
