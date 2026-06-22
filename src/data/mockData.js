export const DISTRICTS = [
  'Kigali', 'Nyagatare', 'Musanze', 'Rwamagana', 'Huye', 'Rubavu',
  'Gicumbi', 'Karongi', 'Muhanga', 'Ngoma', 'Kayonza', 'Rusizi',
]

export const CROP_TYPES = [
  'Maize', 'Beans', 'Rice', 'Vegetables', 'Potatoes', 'Fruits', 'Coffee', 'Sorghum',
]

export const VEHICLE_TYPES = ['Truck', 'Pickup', 'Motorcycle', 'Minivan']

export const DISTRICT_COORDS = {
  Kigali: [-1.9403, 30.0619],
  Nyagatare: [-1.3000, 30.3200],
  Musanze: [-1.5000, 29.6300],
  Rwamagana: [-1.9500, 30.4300],
  Huye: [-2.5900, 29.7400],
  Rubavu: [-1.6900, 29.2600],
  Gicumbi: [-1.5800, 30.0700],
  Karongi: [-2.0600, 29.3500],
  Muhanga: [-2.0800, 29.7500],
  Ngoma: [-2.1800, 30.4800],
  Kayonza: [-1.9300, 30.5200],
  Rusizi: [-2.4800, 28.9000],
}

export const CHART_COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#15803d', '#166534', '#14532d']

export const REVENUE_COLORS = ['#16a34a', '#059669', '#0d9488', '#0891b2', '#6366f1']

export function formatRWF(amount) {
  return new Intl.NumberFormat('en-RW', { style: 'decimal', maximumFractionDigits: 0 }).format(amount) + ' RWF'
}

export function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K+'
  return n.toString()
}

export function cropPricePerKg(crop) {
  if (crop === 'Coffee') return 1200
  if (crop === 'Potatoes') return 380
  if (crop === 'Beans') return 720
  return 450
}
