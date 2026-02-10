import React from "react"

interface ProgressProps {
  value: number
  max?: number
  className?: string
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100, className }) => {
  const percentage = (value / max) * 100
  return (
    <div className={`w-full h-3 bg-gray-200 rounded ${className || ""}`}>
      <div
        className="h-3 bg-blue-600 rounded"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
