import type React from "react"

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-8">
      <p className="text-gray-700 text-xl font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  )
}

export default LoadingSpinner