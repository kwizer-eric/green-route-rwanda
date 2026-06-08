const steps = [
  { key: 'listed', label: 'Listed' },
  { key: 'ordered', label: 'Ordered' },
  { key: 'matched', label: 'Matched' },
  { key: 'transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
]

const roleHints = {
  farmer: 'Your produce moves through this chain',
  transporter: 'You carry goods at the Route step',
  buyer: 'Your order follows this delivery chain',
  admin: 'Platform-wide logistics lifecycle',
}

export default function JourneyStatusBar({ role = 'farmer' }) {
  const activeIndex = 1

  return (
    <div className="mb-6 rounded-xl border border-stone-100 bg-white px-4 py-3">
      <p className="text-xs text-stone-500 mb-3">{roleHints[role] || roleHints.admin}</p>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-center shrink-0">
            <div className="flex flex-col items-center min-w-[4.5rem]">
              <div
                className={`w-2.5 h-2.5 rounded-full mb-1 ${
                  i <= activeIndex ? 'bg-primary' : 'bg-stone-200'
                }`}
              />
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  i <= activeIndex ? 'text-primary' : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 sm:w-10 h-0.5 mb-4 ${i < activeIndex ? 'bg-primary/40' : 'bg-stone-100'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
