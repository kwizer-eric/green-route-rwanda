const styles = {
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Matched: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Active: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'In Transit': 'bg-orange-50 text-orange-700 ring-orange-600/20',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'Awaiting transport': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'Awaiting transporter': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'Awaiting buyer confirmation': 'bg-orange-50 text-orange-700 ring-orange-600/20',
}

export default function StatusBadge({ status }) {
  const style = styles[status] || 'bg-stone-50 text-stone-600 ring-stone-500/20'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${style}`}>
      {status}
    </span>
  )
}
