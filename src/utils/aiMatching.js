const DISTRICT_PROXIMITY = {
  Kigali: ['Rwamagana', 'Muhanga', 'Kayonza', 'Ngoma'],
  Nyagatare: ['Gicumbi', 'Kayonza', 'Rwamagana'],
  Musanze: ['Gicumbi', 'Rubavu', 'Nyagatare'],
  Rwamagana: ['Kigali', 'Kayonza', 'Ngoma', 'Nyagatare'],
  Huye: ['Muhanga', 'Karongi', 'Ngoma'],
  Rubavu: ['Musanze', 'Karongi', 'Rusizi'],
  Gicumbi: ['Musanze', 'Nyagatare', 'Kayonza'],
  Karongi: ['Rubavu', 'Huye', 'Rusizi'],
  Muhanga: ['Kigali', 'Huye', 'Ngoma'],
  Ngoma: ['Rwamagana', 'Kayonza', 'Huye'],
  Kayonza: ['Rwamagana', 'Nyagatare', 'Kigali'],
  Rusizi: ['Rubavu', 'Karongi'],
}

function buildMatchFactors(produce, transporter) {
  const district = produce.district || produce.pickupDistrict || 'Kigali'
  const delivery = produce.deliveryDistrict || 'Kigali'
  const qty = produce.quantity || 0
  const factors = []

  if (transporter.routes?.includes(district)) {
    factors.push({
      label: 'Route overlap',
      impact: '+25',
      detail: `Already serves ${district} → ${delivery}`,
    })
  }

  const nearby = DISTRICT_PROXIMITY[district] || []
  const adjacent = transporter.routes?.find(r => nearby.includes(r))
  if (adjacent && !transporter.routes?.includes(district)) {
    factors.push({
      label: 'Adjacent district',
      impact: '+10',
      detail: `${adjacent} is near pickup zone ${district}`,
    })
  }

  if (transporter.capacity >= qty) {
    factors.push({
      label: 'Full capacity match',
      impact: '+15',
      detail: `${transporter.capacity.toLocaleString()} kg truck covers ${qty.toLocaleString()} kg load`,
    })
  } else if (transporter.capacity >= qty * 0.5) {
    factors.push({
      label: 'Partial capacity fit',
      impact: '+5',
      detail: `Vehicle can carry at least half the load`,
    })
  }

  if (transporter.availability === 'Available' || transporter.availability === undefined) {
    factors.push({
      label: 'Available today',
      impact: '+10',
      detail: 'Vehicle marked available for pickup',
    })
  }

  return factors
}

function scoreMatch(produce, transporter) {
  let score = 60
  const factors = buildMatchFactors(produce, transporter)
  factors.forEach(f => {
    score += parseInt(f.impact, 10)
  })
  return Math.min(score + Math.floor(Math.random() * 5), 98)
}

export function findBestTransporters(produce, transporterList, limit = 3) {
  const district = produce.district || produce.pickupDistrict || 'Kigali'
  const delivery = produce.deliveryDistrict || 'Kigali'

  return transporterList
    .map(t => {
      const factors = buildMatchFactors(produce, t)
      const confidence = factors.length
        ? Math.min(60 + factors.reduce((s, f) => s + parseInt(f.impact, 10), 0), 98)
        : scoreMatch(produce, t)

      return {
        ...t,
        confidence,
        factors,
        route: `${district} → ${delivery}`,
        price: Math.floor(15000 + Math.random() * 70000),
      }
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit)
}

export function explainMatch(produce, transporter) {
  const factors = buildMatchFactors(produce, transporter)
  const confidence = factors.length
    ? Math.min(60 + factors.reduce((s, f) => s + parseInt(f.impact, 10), 0), 98)
    : scoreMatch(produce, transporter)

  return { factors, confidence }
}

export function simulateAIProcessing(ms = 1500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function runAdminMatching(requests, available, transporterList) {
  const pairs = []
  const used = new Set()

  requests.forEach((req, i) => {
    const trans = available[i % available.length]
    if (!used.has(trans.id)) {
      const fullTransporter = transporterList.find(t => t.id === trans.id) || trans
      const { factors, confidence } = explainMatch(req, fullTransporter)
      pairs.push({
        request: req,
        transporter: trans,
        confidence,
        factors,
        price: Math.floor(25000 + Math.random() * 50000),
      })
      used.add(trans.id)
    }
  })

  return pairs
}

/** Sample factors for landing page demo */
export const SAMPLE_MATCH = {
  confidence: 92,
  factors: [
    { label: 'Route overlap', impact: '+25', detail: 'Serves Nyagatare → Kigali weekly' },
    { label: 'Full capacity match', impact: '+15', detail: '5,000 kg truck for 2,000 kg maize' },
    { label: 'Adjacent district', impact: '+10', detail: 'Rwamagana near Eastern pickup zone' },
  ],
}
