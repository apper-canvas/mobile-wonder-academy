import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "Nothing here yet!", 
  message = "Let's add some content to get started!",
  actionLabel = "Get Started",
  onAction,
  icon = "BookOpen"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-32 h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} size={64} className="text-primary" />
      </motion.div>
      
      <h3 className="text-2xl font-display text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </motion.button>
      )}
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-accent/30 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-secondary/30 rounded-full"
        />
      </div>
    </div>
  )
}

export default Empty