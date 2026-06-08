export const DISTRICTS = [
  'Kigali', 'Nyagatare', 'Musanze', 'Rwamagana', 'Huye', 'Rubavu',
  'Gicumbi', 'Karongi', 'Muhanga', 'Ngoma', 'Kayonza', 'Rusizi',
]

export const CROP_TYPES = [
  'Maize', 'Beans', 'Rice', 'Vegetables', 'Potatoes', 'Fruits', 'Coffee', 'Sorghum',
]

export const VEHICLE_TYPES = ['Truck', 'Pickup', 'Motorcycle', 'Minivan']

export const farmers = [
  { id: 'f1', name: 'Uwimana Jean', district: 'Nyagatare', cooperative: 'Eastern Maize Co-op', lat: -1.30, lng: 30.32 },
  { id: 'f2', name: 'Habimana Eric', district: 'Musanze', cooperative: 'Volcanic Highlands Farmers', lat: -1.50, lng: 29.63 },
  { id: 'f3', name: 'Mukamana Grace', district: 'Rwamagana', cooperative: 'Lake Victoria Growers', lat: -1.95, lng: 30.43 },
  { id: 'f4', name: 'Nsengimana Paul', district: 'Huye', cooperative: 'Southern Coffee Alliance', lat: -2.59, lng: 29.74 },
  { id: 'f5', name: 'Uwase Marie', district: 'Rubavu', cooperative: 'Great Lakes Produce', lat: -1.69, lng: 29.26 },
  { id: 'f6', name: 'Bizimana Claude', district: 'Gicumbi', cooperative: 'Northern Bean Collective', lat: -1.58, lng: 30.07 },
  { id: 'f7', name: 'Ingabire Alice', district: 'Karongi', cooperative: 'Western Highlands Co-op', lat: -2.06, lng: 29.35 },
  { id: 'f8', name: 'Mugisha Patrick', district: 'Kigali', cooperative: 'Urban Fresh Network', lat: -1.94, lng: 30.06 },
]

export const transporters = [
  { id: 't1', name: 'Kamanzi Transport Ltd', vehicleType: 'Truck', capacity: 5000, licensePlate: 'RAD 234 A', routes: ['Nyagatare', 'Kigali', 'Rwamagana'], lat: -1.32, lng: 30.28, rating: 4.9 },
  { id: 't2', name: 'Musanze Logistics', vehicleType: 'Pickup', capacity: 1200, licensePlate: 'RAB 891 B', routes: ['Musanze', 'Rubavu', 'Gicumbi'], lat: -1.51, lng: 29.61, rating: 4.7 },
  { id: 't3', name: 'Southern Express', vehicleType: 'Truck', capacity: 8000, licensePlate: 'RAC 456 C', routes: ['Huye', 'Muhanga', 'Kigali'], lat: -2.58, lng: 29.72, rating: 4.8 },
  { id: 't4', name: 'QuickMove Rwanda', vehicleType: 'Minivan', capacity: 800, licensePlate: 'RAE 112 D', routes: ['Kigali', 'Rwamagana', 'Kayonza'], lat: -1.95, lng: 30.08, rating: 4.6 },
  { id: 't5', name: 'Lake Route Carriers', vehicleType: 'Truck', capacity: 6000, licensePlate: 'RAF 778 E', routes: ['Rubavu', 'Karongi', 'Rusizi'], lat: -1.70, lng: 29.30, rating: 4.8 },
  { id: 't6', name: 'AgriMoto Express', vehicleType: 'Motorcycle', capacity: 150, licensePlate: 'RAG 003 F', routes: ['Kigali', 'Muhanga', 'Huye'], lat: -1.93, lng: 30.05, rating: 4.5 },
]

export const buyers = [
  { id: 'b1', name: 'Kigali Fresh Market', type: 'Wholesale', district: 'Kigali' },
  { id: 'b2', name: 'Remera Food Hub', type: 'Retail Chain', district: 'Kigali' },
  { id: 'b3', name: 'Eastern Grain Depot', type: 'Wholesale', district: 'Rwamagana' },
  { id: 'b4', name: 'Hotel des Mille Collines', type: 'Hospitality', district: 'Kigali' },
]

export const produceListings = [
  { id: 'pl1', farmerId: 'f1', farmerName: 'Uwimana Jean', crop: 'Maize', quantity: 2500, district: 'Nyagatare', pricePerKg: 450, availableDate: '2026-06-05', status: 'Matched', freshness: 'Excellent', notes: 'Grade A dried maize' },
  { id: 'pl2', farmerId: 'f2', farmerName: 'Habimana Eric', crop: 'Potatoes', quantity: 1800, district: 'Musanze', pricePerKg: 380, availableDate: '2026-06-04', status: 'In Transit', freshness: 'Excellent', notes: 'Irish potatoes, volcanic soil' },
  { id: 'pl3', farmerId: 'f3', farmerName: 'Mukamana Grace', crop: 'Beans', quantity: 900, district: 'Rwamagana', pricePerKg: 720, availableDate: '2026-06-06', status: 'Pending', freshness: 'Good', notes: 'Red kidney beans' },
  { id: 'pl4', farmerId: 'f4', farmerName: 'Nsengimana Paul', crop: 'Coffee', quantity: 600, district: 'Huye', pricePerKg: 1200, availableDate: '2026-06-07', status: 'Delivered', freshness: 'Excellent', notes: 'Arabica, fully washed' },
  { id: 'pl5', farmerId: 'f5', farmerName: 'Uwase Marie', crop: 'Vegetables', quantity: 400, district: 'Rubavu', pricePerKg: 350, availableDate: '2026-06-05', status: 'Matched', freshness: 'Good', notes: 'Mixed seasonal vegetables' },
  { id: 'pl6', farmerId: 'f6', farmerName: 'Bizimana Claude', crop: 'Sorghum', quantity: 1200, district: 'Gicumbi', pricePerKg: 420, availableDate: '2026-06-08', status: 'Pending', freshness: 'Excellent', notes: 'Drought-resistant variety' },
  { id: 'pl7', farmerId: 'f7', farmerName: 'Ingabire Alice', crop: 'Fruits', quantity: 750, district: 'Karongi', pricePerKg: 580, availableDate: '2026-06-04', status: 'In Transit', freshness: 'Good', notes: 'Avocados and passion fruit' },
  { id: 'pl8', farmerId: 'f8', farmerName: 'Mugisha Patrick', crop: 'Rice', quantity: 1100, district: 'Kigali', pricePerKg: 890, availableDate: '2026-06-06', status: 'Pending', freshness: 'Excellent', notes: 'Local paddy rice' },
]

export const transportJobs = [
  { id: 'tj1', listingId: 'pl1', crop: 'Maize', quantity: 2500, pickupDistrict: 'Nyagatare', deliveryDistrict: 'Kigali', price: 65000, distance: 148, transporterId: 't1', aiOptimized: true },
  { id: 'tj2', listingId: 'pl2', crop: 'Potatoes', quantity: 1800, pickupDistrict: 'Musanze', deliveryDistrict: 'Rubavu', price: 28000, distance: 62, transporterId: 't2', aiOptimized: true },
  { id: 'tj3', listingId: 'pl3', crop: 'Beans', quantity: 900, pickupDistrict: 'Rwamagana', deliveryDistrict: 'Kigali', price: 35000, distance: 54, transporterId: null, aiOptimized: false },
  { id: 'tj4', listingId: 'pl5', crop: 'Vegetables', quantity: 400, pickupDistrict: 'Rubavu', deliveryDistrict: 'Kigali', price: 42000, distance: 156, transporterId: 't5', aiOptimized: false },
  { id: 'tj5', listingId: 'pl6', crop: 'Sorghum', quantity: 1200, pickupDistrict: 'Gicumbi', deliveryDistrict: 'Nyagatare', price: 48000, distance: 95, transporterId: null, aiOptimized: true },
  { id: 'tj6', listingId: 'pl7', crop: 'Fruits', quantity: 750, pickupDistrict: 'Karongi', deliveryDistrict: 'Huye', price: 32000, distance: 88, transporterId: 't3', aiOptimized: false },
  { id: 'tj7', listingId: 'pl8', crop: 'Rice', quantity: 1100, pickupDistrict: 'Kigali', deliveryDistrict: 'Muhanga', price: 22000, distance: 48, transporterId: null, aiOptimized: true },
]

export const transportMatches = [
  { id: 'tm1', listingId: 'pl3', transporterId: 't4', transporterName: 'QuickMove Rwanda', vehicleType: 'Minivan', capacity: 800, route: 'Rwamagana → Kigali', price: 35000, confidence: 94 },
  { id: 'tm2', listingId: 'pl6', transporterId: 't1', transporterName: 'Kamanzi Transport Ltd', vehicleType: 'Truck', capacity: 5000, route: 'Gicumbi → Nyagatare', price: 48000, confidence: 91 },
  { id: 'tm3', listingId: 'pl8', transporterId: 't6', transporterName: 'AgriMoto Express', vehicleType: 'Motorcycle', capacity: 150, route: 'Kigali → Muhanga', price: 18000, confidence: 87 },
]

export const trips = [
  { id: 'tr1', transporterId: 't1', crop: 'Maize', quantity: 2500, from: 'Nyagatare', to: 'Kigali', status: 'In Transit', earnings: 65000, date: '2026-06-03' },
  { id: 'tr2', transporterId: 't2', crop: 'Potatoes', quantity: 1800, from: 'Musanze', to: 'Rubavu', status: 'In Transit', earnings: 28000, date: '2026-06-03' },
  { id: 'tr3', transporterId: 't3', crop: 'Fruits', quantity: 750, from: 'Karongi', to: 'Huye', status: 'Active', earnings: 32000, date: '2026-06-04' },
  { id: 'tr4', transporterId: 't1', crop: 'Beans', quantity: 800, from: 'Kayonza', to: 'Kigali', status: 'Completed', earnings: 38000, date: '2026-06-01' },
  { id: 'tr5', transporterId: 't5', crop: 'Coffee', quantity: 500, from: 'Huye', to: 'Kigali', status: 'Completed', earnings: 55000, date: '2026-05-28' },
  { id: 'tr6', transporterId: 't4', crop: 'Vegetables', quantity: 300, from: 'Rwamagana', to: 'Kigali', status: 'Completed', earnings: 15000, date: '2026-05-30' },
]

export const orders = [
  { id: 'o1', buyerId: 'b1', produceId: 'pl1', crop: 'Maize', farmerName: 'Uwimana Jean', quantity: 500, district: 'Nyagatare', pricePerKg: 450, total: 225000, status: 'In Transit', deliveryAddress: 'KN 3 Rd, Kigali', deliveryDate: '2026-06-06', payment: 'Mobile Money' },
  { id: 'o2', buyerId: 'b2', produceId: 'pl2', crop: 'Potatoes', farmerName: 'Habimana Eric', quantity: 200, district: 'Musanze', pricePerKg: 380, total: 76000, status: 'Matched', deliveryAddress: 'KG 7 Ave, Remera', deliveryDate: '2026-06-05', payment: 'Cash on Delivery' },
  { id: 'o3', buyerId: 'b4', produceId: 'pl4', crop: 'Coffee', farmerName: 'Nsengimana Paul', quantity: 100, district: 'Huye', pricePerKg: 1200, total: 120000, status: 'Delivered', deliveryAddress: 'Avenue de la Paix, Kigali', deliveryDate: '2026-06-01', payment: 'Mobile Money' },
  { id: 'o4', buyerId: 'b3', produceId: 'pl6', crop: 'Sorghum', farmerName: 'Bizimana Claude', quantity: 800, district: 'Gicumbi', pricePerKg: 420, total: 336000, status: 'Processing', deliveryAddress: 'Main Market, Rwamagana', deliveryDate: '2026-06-08', payment: 'Mobile Money' },
  { id: 'o5', buyerId: 'b1', produceId: 'pl7', crop: 'Fruits', farmerName: 'Ingabire Alice', quantity: 150, district: 'Karongi', pricePerKg: 580, total: 87000, status: 'Processing', deliveryAddress: 'KN 3 Rd, Kigali', deliveryDate: '2026-06-07', payment: 'Cash on Delivery' },
]

export const platformStats = {
  farmers: 60247,
  transporters: 3512,
  buyers: 634,
  foodWasteReduction: 25,
  activeJobsToday: 847,
  revenueThisMonth: 42850000,
  postHarvestLossReduction: 23.4,
}

export const mapMarkers = {
  farmers: farmers.map(f => ({ ...f, type: 'farmer' })),
  transporters: transporters.map(t => ({ ...t, type: 'transporter' })),
  activeRoutes: [
    { from: [-1.30, 30.32], to: [-1.94, 30.06], label: 'Maize: Nyagatare → Kigali' },
    { from: [-1.50, 29.63], to: [-1.69, 29.26], label: 'Potatoes: Musanze → Rubavu' },
    { from: [-2.06, 29.35], to: [-2.59, 29.74], label: 'Fruits: Karongi → Huye' },
    { from: [-1.58, 30.07], to: [-1.30, 30.32], label: 'Sorghum: Gicumbi → Nyagatare' },
  ],
}

export const unmatchedRequests = [
  { id: 'ur1', farmer: 'Mukamana Grace', crop: 'Beans', quantity: 900, district: 'Rwamagana' },
  { id: 'ur2', farmer: 'Bizimana Claude', crop: 'Sorghum', quantity: 1200, district: 'Gicumbi' },
  { id: 'ur3', farmer: 'Mugisha Patrick', crop: 'Rice', quantity: 1100, district: 'Kigali' },
  { id: 'ur4', farmer: 'Uwase Marie', crop: 'Vegetables', quantity: 400, district: 'Rubavu' },
]

export const availableTransporters = [
  { id: 't4', name: 'QuickMove Rwanda', vehicle: 'Minivan', capacity: 800, district: 'Kigali' },
  { id: 't1', name: 'Kamanzi Transport Ltd', vehicle: 'Truck', capacity: 5000, district: 'Nyagatare' },
  { id: 't6', name: 'AgriMoto Express', vehicle: 'Motorcycle', capacity: 150, district: 'Kigali' },
  { id: 't5', name: 'Lake Route Carriers', vehicle: 'Truck', capacity: 6000, district: 'Rubavu' },
]

export const monthlyTransactions = [
  { month: 'Jan', transactions: 1240 },
  { month: 'Feb', transactions: 1580 },
  { month: 'Mar', transactions: 1820 },
  { month: 'Apr', transactions: 2100 },
  { month: 'May', transactions: 2450 },
  { month: 'Jun', transactions: 2680 },
]

export const cropVolume = [
  { crop: 'Maize', volume: 4200 },
  { crop: 'Beans', volume: 2800 },
  { crop: 'Potatoes', volume: 3100 },
  { crop: 'Coffee', volume: 1200 },
  { crop: 'Vegetables', volume: 1900 },
  { crop: 'Rice', volume: 1600 },
  { crop: 'Fruits', volume: 1400 },
  { crop: 'Sorghum', volume: 980 },
]

export const revenueStreams = [
  { name: 'Transaction Commissions', value: 42, amount: 17997000 },
  { name: 'Subscriptions', value: 22, amount: 9427000 },
  { name: 'Buyer Fees', value: 18, amount: 7713000 },
  { name: 'Data Services', value: 12, amount: 5142000 },
  { name: 'Grants', value: 6, amount: 2571000 },
]

export const impactMetrics = [
  { label: 'Post-Harvest Loss Reduction', value: '23.4%', change: '+4.2%', icon: 'trending' },
  { label: 'Farmer Income Increase', value: '18.7%', change: '+2.8%', icon: 'users' },
  { label: 'CO₂ Saved', value: '1,240 tons', change: '+156 tons', icon: 'leaf' },
  { label: 'Empty Trips Reduced', value: '31.2%', change: '+5.1%', icon: 'truck' },
]

export const weeklyEarnings = [
  { week: 'W1', earnings: 185000 },
  { week: 'W2', earnings: 242000 },
  { week: 'W3', earnings: 198000 },
  { week: 'W4', earnings: 310000 },
  { week: 'W5', earnings: 275000 },
  { week: 'W6', earnings: 348000 },
]

export const farmerDashboard = {
  name: 'Uwimana Jean',
  cooperative: 'Eastern Maize Co-op',
  activeListings: 3,
  pendingPickups: 2,
  completedDeliveries: 47,
  estimatedEarnings: 1250000,
}

export const transporterDashboard = {
  name: 'Kamanzi Transport Ltd',
  availableJobs: 12,
  activeTrips: 2,
  completedTrips: 156,
  totalEarnings: 8450000,
}

export const buyerDashboard = {
  name: 'Kigali Fresh Market',
  availableProduce: 847,
  activeOrders: 3,
  deliveredOrders: 124,
  totalSpent: 15680000,
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
