interface WavySeparatorProps {
  color?: string
  height?: number
  className?: string
}

export function WavySeparator({ color = "#F8C8DC", height = 50, className }: WavySeparatorProps) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 1200 ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ height: `${height}px` }}
      >
        <path
          d={`M0,${height / 2} C300,0 900,${height} 1200,${height / 2} L1200,${height} L0,${height} Z`}
          fill={color}
        ></path>
      </svg>
    </div>
  )
}
