import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  showLabel = true, 
  size = 'medium',
  color = 'primary',
  className = '' 
}) => {
  const sizes = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  }
  
  const colors = {
    primary: 'from-primary to-purple-600',
    secondary: 'from-secondary to-pink-500',
    accent: 'from-accent to-yellow-400',
    success: 'from-success to-green-500'
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`progress-bar ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`progress-fill bg-gradient-to-r ${colors[color]}`}
        />
      </div>
    </div>
  )
}

export default ProgressBar