import { createContext, useContext, useState } from 'react'
import {
  produceListings as initialListings,
  transporters as initialTransporters,
  orders as initialOrders,
  trips as initialTrips,
  transportJobs as initialJobs,
  unmatchedRequests as initialUnmatchedRequests,
  availableTransporters as initialAvailableTransporters,
} from '../data/mockData'

const AppContext = createContext()

export function AppContextProvider({ children }) {
  const [listings, setListings] = useState(initialListings)
  const [transporters, setTransporters] = useState(initialTransporters)
  const [orders, setOrders] = useState(initialOrders)
  const [trips, setTrips] = useState(initialTrips)
  const [jobs, setJobs] = useState(initialJobs)
  const [unmatchedRequests, setUnmatchedRequests] = useState(initialUnmatchedRequests)
  const [availableTransporters, setAvailableTransporters] = useState(initialAvailableTransporters)

  // 1. Farmer Lists Produce
  const addListing = (crop, quantity, district, date, notes) => {
    const newId = `pl${listings.length + 1}`
    const qty = Number(quantity)
    const pricePerKg = crop === 'Coffee' ? 1200 : crop === 'Potatoes' ? 380 : crop === 'Beans' ? 720 : 450

    const newListing = {
      id: newId,
      farmerId: 'f1', // Uwimana Jean (default user in portal)
      farmerName: 'Uwimana Jean',
      crop,
      quantity: qty,
      district,
      pricePerKg,
      availableDate: date,
      status: 'Pending',
      freshness: 'Excellent',
      notes,
    }

    setListings(prev => [newListing, ...prev])

    // Also add to unmatched requests
    const newUnmatched = {
      id: `ur${unmatchedRequests.length + 1}`,
      farmer: 'Uwimana Jean',
      crop,
      quantity: qty,
      district,
      listingId: newId,
    }
    setUnmatchedRequests(prev => [newUnmatched, ...prev])
  }

  // 2. Transporter Registers Vehicle
  const registerVehicle = (type, capacity, plate, routes, availability) => {
    const newTransporterId = `t${transporters.length + 1}`
    const cap = Number(capacity)

    const newTransporter = {
      id: newTransporterId,
      name: 'Kamanzi Transport Ltd', // Default login transporter
      vehicleType: type,
      capacity: cap,
      licensePlate: plate,
      routes,
      lat: -1.94,
      lng: 30.06,
      rating: 5.0,
      availability,
    }
    setTransporters(prev => [...prev, newTransporter])

    const newAvail = {
      id: newTransporterId,
      name: 'Kamanzi Transport Ltd',
      vehicle: type,
      capacity: cap,
      district: routes[0] || 'Kigali',
    }
    setAvailableTransporters(prev => [...prev, newAvail])
  }

  // 3. Buyer Places Order
  const placeOrder = (produceId, quantity, address, date, payment) => {
    const listing = listings.find(l => l.id === produceId)
    if (!listing) return

    const qty = Number(quantity)
    const newId = `o${orders.length + 1}`
    const total = qty * listing.pricePerKg

    // Decrement listing quantity
    setListings(prev =>
      prev.map(l => {
        if (l.id === produceId) {
          const updatedQty = Math.max(0, l.quantity - qty)
          return {
            ...l,
            quantity: updatedQty,
            status: updatedQty === 0 ? 'Processing' : l.status,
          }
        }
        return l
      })
    )

    const newOrder = {
      id: newId,
      buyerId: 'b1',
      produceId,
      crop: listing.crop,
      farmerName: listing.farmerName,
      quantity: qty,
      district: listing.district,
      pricePerKg: listing.pricePerKg,
      total,
      status: 'Processing',
      deliveryAddress: address,
      deliveryDate: date,
      payment,
    }
    setOrders(prev => [newOrder, ...prev])
  }

  // 4. Accept a Match (by Farmer or auto-matched)
  const acceptMatch = (listingId, transporterId, price) => {
    // Update Listing status
    setListings(prev =>
      prev.map(l => (l.id === listingId ? { ...l, status: 'Matched' } : l))
    )

    const listing = listings.find(l => l.id === listingId)
    const transporterObj = transporters.find(t => t.id === transporterId)

    if (!listing || !transporterObj) return

    // Create a Transport Job
    const jobId = `tj${jobs.length + 1}`
    const newJob = {
      id: jobId,
      listingId,
      crop: listing.crop,
      quantity: listing.quantity,
      pickupDistrict: listing.district,
      deliveryDistrict: 'Kigali',
      price,
      distance: 80,
      transporterId,
      aiOptimized: true,
    }
    setJobs(prev => [newJob, ...prev])

    // Create a Trip
    const tripId = `tr${trips.length + 1}`
    const newTrip = {
      id: tripId,
      transporterId,
      listingId,
      crop: listing.crop,
      quantity: listing.quantity,
      from: listing.district,
      to: 'Kigali',
      status: 'Active',
      earnings: price,
      date: new Date().toISOString().split('T')[0],
    }
    setTrips(prev => [newTrip, ...prev])

    // Remove from unmatched
    setUnmatchedRequests(prev => prev.filter(ur => ur.listingId !== listingId && ur.farmer !== listing.farmerName))
  }

  // 5. Accept Job (by Transporter)
  const acceptJob = (jobId, transporterId) => {
    const job = jobs.find(j => j.id === jobId)
    if (!job) return

    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, transporterId } : j))
    )

    setListings(prev =>
      prev.map(l => (l.id === job.listingId ? { ...l, status: 'Matched' } : l))
    )

    const tripId = `tr${trips.length + 1}`
    const newTrip = {
      id: tripId,
      transporterId,
      listingId: job.listingId,
      crop: job.crop,
      quantity: job.quantity,
      from: job.pickupDistrict,
      to: job.deliveryDistrict,
      status: 'Active',
      earnings: job.price,
      date: new Date().toISOString().split('T')[0],
    }
    setTrips(prev => [newTrip, ...prev])
  }

  // 6. Update Trip Status (Active -> In Transit -> Completed)
  const updateTripStatus = (tripId, nextStatus) => {
    setTrips(prev =>
      prev.map(t => (t.id === tripId ? { ...t, status: nextStatus } : t))
    )

    const trip = trips.find(t => t.id === tripId)
    if (!trip) return

    const mappingStatus = nextStatus === 'In Transit' ? 'In Transit' : nextStatus === 'Completed' ? 'Delivered' : nextStatus

    // Update Listing status
    if (trip.listingId) {
      setListings(prev =>
        prev.map(l => (l.id === trip.listingId ? { ...l, status: mappingStatus } : l))
      )

      // Also update matching orders
      setOrders(prev =>
        prev.map(o => (o.produceId === trip.listingId ? { ...o, status: mappingStatus } : o))
      )
    } else {
      // Fallback matching by crop, from, to
      setListings(prev =>
        prev.map(l =>
          l.crop === trip.crop && l.district === trip.from && l.status !== 'Delivered'
            ? { ...l, status: mappingStatus }
            : l
        )
      )
      setOrders(prev =>
        prev.map(o =>
          o.crop === trip.crop && o.district === trip.from && o.status !== 'Delivered'
            ? { ...o, status: mappingStatus }
            : o
        )
      )
    }
  }

  // 7. Auto Run Matchmaker from Admin
  const runAdminAutoMatching = () => {
    if (unmatchedRequests.length === 0 || availableTransporters.length === 0) return []

    const pairs = []
    const usedTransporterIds = new Set()
    
    const unmatchedCopy = [...unmatchedRequests]
    const availableCopy = [...availableTransporters]

    unmatchedCopy.forEach((req, idx) => {
      // Find a transporter
      const trans = availableCopy[idx % availableCopy.length]
      if (!usedTransporterIds.has(trans.id)) {
        const confidence = 85 + Math.floor(Math.random() * 14)
        const price = Math.floor(25000 + Math.random() * 50000)

        pairs.push({
          request: req,
          transporter: trans,
          confidence,
          price,
        })
        usedTransporterIds.add(trans.id)

        // Actually apply the match!
        const lId = req.listingId || `pl${idx + 1}`
        acceptMatch(lId, trans.id, price)
      }
    })

    return pairs
  }

  return (
    <AppContext.Provider
      value={{
        listings,
        transporters,
        orders,
        trips,
        jobs,
        unmatchedRequests,
        availableTransporters,
        addListing,
        registerVehicle,
        placeOrder,
        acceptMatch,
        acceptJob,
        updateTripStatus,
        runAdminAutoMatching,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppContextProvider')
  }
  return context
}
