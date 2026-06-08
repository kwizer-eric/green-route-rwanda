import { useState } from 'react'
import { MapPin, Check } from 'lucide-react'
import { PageHeader, Button, Card } from '../../components/ui'
import AIRecommendedBadge from '../../components/AIRecommendedBadge'
import { formatRWF } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

export default function AvailableJobs() {
  const { jobs, acceptJob } = useApp()
  const [accepted, setAccepted] = useState(new Set())

  // Show jobs that don't have a transporter assigned yet
  const availableJobs = jobs.filter(j => !j.transporterId)

  const handleAccept = (jobId) => {
    acceptJob(jobId, 't1') // Default logged in transporter Kamanzi (t1)
    setAccepted(prev => new Set([...prev, jobId]))
  }

  return (
    <div>
      <PageHeader title="Available Jobs" description="Browse and accept transport jobs across Rwanda." />
      <div className="grid gap-4">
        {availableJobs.map(job => (

          <Card key={job.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-stone-900">{job.crop}</h3>
                  <span className="text-sm text-stone-500">{job.quantity.toLocaleString()} kg</span>
                  {job.aiOptimized && <AIRecommendedBadge label="AI Optimized Route" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <MapPin size={14} className="text-stone-400" />
                  {job.pickupDistrict} → {job.deliveryDistrict}
                  <span className="text-stone-300">·</span>
                  {job.distance} km
                </div>
                <p className="text-lg font-semibold text-stone-900">{formatRWF(job.price)}</p>
              </div>
              <Button
                variant={accepted.has(job.id) ? 'secondary' : 'primary'}
                disabled={accepted.has(job.id)}
                onClick={() => handleAccept(job.id)}
                className="shrink-0"
              >
                {accepted.has(job.id) ? <><Check size={16} /> Accepted</> : 'Accept Job'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
