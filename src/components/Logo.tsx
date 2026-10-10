export function Logo({ light = false, size = 'md' }: { light?: boolean; size?: 'sm' | 'md' }) {
  const text = light ? 'text-ivory' : 'text-blood-deep'
  const mark = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  return (
    <span className={`inline-flex items-center gap-2 ${text}`}>
      <svg className={mark} viewBox="0 0 40 40" aria-hidden>
        <rect width="40" height="40" rx="12" fill={light ? '#f6efe4' : '#8b1530'} />
        <path
          d="M20 8c-6 7.8-10 13.1-10 17.6C10 31.1 14.5 35.5 20 35.5S30 31.1 30 25.6C30 21.1 26 15.8 20 8z"
          fill={light ? '#8b1530' : '#f6efe4'}
        />
        <path d="M12 22h16" stroke={light ? '#8b1530' : '#f6efe4'} strokeWidth="1.6" opacity="0.55" />
      </svg>
      <span className={`font-display leading-none ${size === 'sm' ? 'text-lg' : 'text-xl'}`}>
        BloodBridge
      </span>
    </span>
  )
}
