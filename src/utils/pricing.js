import { DISTRICT_COORDS, cropPricePerKg } from '../data/mockData'

export const DEFAULT_TRANSPORT_PER_KM_RWF = 120
const TRANSPORT_BASE_RWF = 8_000
const TRANSPORT_PER_100KG_RWF = 500
const TRANSPORT_MIN_RWF = 12_000

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function estimateDistrictDistanceKm(fromDistrict, toDistrict) {
  if (!fromDistrict || !toDistrict) return 40
  if (fromDistrict === toDistrict) return 15

  const from = DISTRICT_COORDS[fromDistrict] || DISTRICT_COORDS.Kigali
  const to = DISTRICT_COORDS[toDistrict] || DISTRICT_COORDS.Kigali
  return Math.max(20, Math.round(haversineKm(from[0], from[1], to[0], to[1])))
}

export function calculateTransportPrice({
  pickupDistrict,
  deliveryDistrict,
  quantityKg,
  pricePerKm = DEFAULT_TRANSPORT_PER_KM_RWF,
}) {
  const distanceKm = estimateDistrictDistanceKm(pickupDistrict, deliveryDistrict)
  const qty = Number(quantityKg) || 0
  const perKm = Number(pricePerKm) > 0 ? Number(pricePerKm) : DEFAULT_TRANSPORT_PER_KM_RWF
  const raw =
    TRANSPORT_BASE_RWF +
    distanceKm * perKm +
    (qty / 100) * TRANSPORT_PER_100KG_RWF
  const price = Math.max(TRANSPORT_MIN_RWF, Math.round(raw / 500) * 500)

  return { price, distanceKm, pricePerKm: perKm }
}

export function resolveProducePricePerKg(crop, farmerPrice) {
  const custom = Number(farmerPrice)
  if (farmerPrice !== '' && farmerPrice != null && !Number.isNaN(custom) && custom > 0) {
    return custom
  }
  return cropPricePerKg(crop)
}

export function orderTotalRWF(quantityKg, pricePerKg) {
  return Number(quantityKg) * Number(pricePerKg)
}
