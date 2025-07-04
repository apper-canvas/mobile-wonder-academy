import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name="AlertCircle" size={48} className="text-error" />
      </motion.div>
      
      <h3 className="text-2xl font-display text-gray-800 mb-4">Oops! Something went wrong</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message || "We're having trouble loading your content right now. Don't worry, let's try again!"}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="btn-primary flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={20} />
          Try Again
        </motion.button>
      )}
    </div>
  )
}

export default Error