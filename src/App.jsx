import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  LayoutDashboard, Package, List, Truck, Briefcase, Route as RouteIcon, DollarSign,
  ShoppingCart, Search, ClipboardList, Map, Brain, BarChart3, Heart, ListOrdered, Users,
} from 'lucide-react'
import PortalLayout from './components/PortalLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { AppContextProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'

import FarmerDashboard from './pages/farmer/FarmerDashboard'
import ListProduce from './pages/farmer/ListProduce'
import MyListings from './pages/farmer/MyListings'
import TransportMatches from './pages/farmer/TransportMatches'

import TransporterDashboard from './pages/transporter/TransporterDashboard'
import RegisterVehicle from './pages/transporter/RegisterVehicle'
import AvailableJobs from './pages/transporter/AvailableJobs'
import MyTrips from './pages/transporter/MyTrips'
import Earnings from './pages/transporter/Earnings'

import BuyerDashboard from './pages/buyer/BuyerDashboard'
import BrowseProduce from './pages/buyer/BrowseProduce'
import PlaceOrder from './pages/buyer/PlaceOrder'
import MyOrders from './pages/buyer/MyOrders'

import AdminDashboard from './pages/admin/AdminDashboard'
import LiveMap from './pages/admin/LiveMap'
import AIMatching from './pages/admin/AIMatching'
import Analytics from './pages/admin/Analytics'
import ImpactMetrics from './pages/admin/ImpactMetrics'
import PlatformOrders from './pages/admin/PlatformOrders'
import PlatformDirectory from './pages/admin/PlatformDirectory'

const farmerLinks = [
  { to: '/farmer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/farmer/list', label: 'List Produce', icon: Package },
  { to: '/farmer/listings', label: 'My Listings', icon: List },
  { to: '/farmer/matches', label: 'Transport Matches', icon: Truck },
]

const transporterLinks = [
  { to: '/transporter', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transporter/register', label: 'Register Vehicle', icon: Truck },
  { to: '/transporter/jobs', label: 'Available Jobs', icon: Briefcase },
  { to: '/transporter/trips', label: 'My Trips', icon: RouteIcon },
  { to: '/transporter/earnings', label: 'Earnings', icon: DollarSign },
]

const buyerLinks = [
  { to: '/buyer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/buyer/browse', label: 'Browse Produce', icon: Search },
  { to: '/buyer/order', label: 'Place Order', icon: ShoppingCart },
  { to: '/buyer/orders', label: 'My Orders', icon: ClipboardList },
]

const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/directory', label: 'Platform Directory', icon: Users },
  { to: '/admin/orders', label: 'Platform Orders', icon: ListOrdered },
  { to: '/admin/map', label: 'Live Map', icon: Map },
  { to: '/admin/matching', label: 'AI Matching', icon: Brain },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/impact', label: 'Impact Metrics', icon: Heart },
]

export default function App() {
  return (
    <AuthProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/farmer"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <PortalLayout portalName="Farmer Portal" links={farmerLinks} />
                </ProtectedRoute>
              }
            >
              <Route index element={<FarmerDashboard />} />
              <Route path="list" element={<ListProduce />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="matches" element={<TransportMatches />} />
            </Route>

            <Route
              path="/transporter"
              element={
                <ProtectedRoute allowedRole="transporter">
                  <PortalLayout portalName="Transporter Portal" links={transporterLinks} />
                </ProtectedRoute>
              }
            >
              <Route index element={<TransporterDashboard />} />
              <Route path="register" element={<RegisterVehicle />} />
              <Route path="jobs" element={<AvailableJobs />} />
              <Route path="trips" element={<MyTrips />} />
              <Route path="earnings" element={<Earnings />} />
            </Route>

            <Route
              path="/buyer"
              element={
                <ProtectedRoute allowedRole="buyer">
                  <PortalLayout portalName="Buyer Portal" links={buyerLinks} />
                </ProtectedRoute>
              }
            >
              <Route index element={<BuyerDashboard />} />
              <Route path="browse" element={<BrowseProduce />} />
              <Route path="order" element={<PlaceOrder />} />
              <Route path="orders" element={<MyOrders />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <PortalLayout portalName="Admin Dashboard" links={adminLinks} />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="directory" element={<PlatformDirectory />} />
              <Route path="orders" element={<PlatformOrders />} />
              <Route path="map" element={<LiveMap />} />
              <Route path="matching" element={<AIMatching />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="impact" element={<ImpactMetrics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </AuthProvider>
  )
}
