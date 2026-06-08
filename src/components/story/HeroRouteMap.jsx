import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'

const NYAGATARE = [-1.3, 30.32]
const KIGALI = [-1.9403, 30.0619]
const ROUTE = [NYAGATARE, KIGALI]

const originIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#16a34a;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const destinationIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#f97316;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

function FitRouteBounds() {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(L.latLngBounds(ROUTE), { padding: [48, 48] })
  }, [map])
  return null
}

export default function HeroRouteMap() {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
  }, [])

  return (
    <div className="relative rounded-2xl shadow-xl border border-stone-100 overflow-hidden bg-white">
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-xs shadow-sm border border-stone-100">
        <p className="font-semibold text-stone-900">Demo route</p>
        <p className="text-stone-500 mt-0.5">Nyagatare → Kigali · ~150 km</p>
      </div>
      <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-1.5 text-[10px] bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-2 border border-stone-100">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Farm pickup</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> Market delivery</span>
      </div>
      <MapContainer
        center={[-1.62, 30.19]}
        zoom={8}
        className="h-[260px] sm:h-[320px] lg:h-[380px] w-full"
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitRouteBounds />
        <Polyline
          positions={ROUTE}
          pathOptions={{ color: '#16a34a', weight: 4, opacity: 0.85, dashArray: '10 6' }}
        />
        <Marker position={NYAGATARE} icon={originIcon}>
          <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false}>
            Nyagatare · Maize pickup
          </Tooltip>
        </Marker>
        <Marker position={KIGALI} icon={destinationIcon}>
          <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false}>
            Kigali · Market delivery
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  )
}
