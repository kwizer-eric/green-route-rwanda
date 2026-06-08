import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChevronRight, Play } from 'lucide-react'
import { Button } from '../ui'

const WALKTHROUGH_KEY = 'greenroute-walkthrough-step'

const steps = [
  {
    title: 'Farmer lists produce',
    talk: 'A farmer in Nyagatare signals available harvest — today this supply signal is disconnected from transport.',
    path: '/farmer/list',
    action: 'Go to List Produce',
  },
  {
    title: 'Buyer places order',
    talk: 'Demand enters the same system. Buyers get coordinated delivery, not just a marketplace listing.',
    path: '/buyer/browse',
    action: 'Browse Produce',
  },
  {
    title: 'AI matches transport',
    talk: 'The engine pairs produce with the best transporter by route, capacity, and proximity — fully visible, not a black box.',
    path: '/admin/matching',
    action: 'Open AI Matching',
  },
  {
    title: 'Transporter accepts job',
    talk: 'Trucks fill up instead of returning empty. Fewer wasted trips, lower fuel use.',
    path: '/transporter/jobs',
    action: 'View Available Jobs',
  },
  {
    title: 'Impact becomes visible',
    talk: 'Delivery completes — less spoilage, stronger rural-urban links, measurable impact on waste and emissions.',
    path: '/admin/impact',
    action: 'See Impact Metrics',
  },
]

export default function GuidedWalkthrough({ open, onClose }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(WALKTHROUGH_KEY)
    return saved ? Number(saved) : 0
  })

  useEffect(() => {
    localStorage.setItem(WALKTHROUGH_KEY, String(step))
  }, [step])

  if (!open) return null

  const current = steps[step]

  const goToStep = () => {
    navigate(current.path)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">Guided Demo</p>
            <p className="text-sm text-stone-500">Step {step + 1} of {steps.length}</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6">
          <h2 className="text-xl font-semibold text-stone-900">{current.title}</h2>
          <p className="mt-3 text-stone-600 leading-relaxed">{current.talk}</p>

          <div className="flex gap-1.5 mt-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-stone-100'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 bg-stone-50 border-t border-stone-100">
          <Button
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
          >
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={goToStep}>
              <Play size={14} /> {current.action}
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)}>
                Next <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={onClose}>Finish</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function WalkthroughTrigger({ onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-dark shadow-sm transition-all ${className}`}
    >
      <Play size={16} /> Start Guided Demo
    </button>
  )
}
