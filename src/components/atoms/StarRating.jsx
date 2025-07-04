import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StarRating = ({ rating = 0, maxRating = 3, size = 'medium', showCount = false }) => {
  const sizes = {
    small: 16,
    medium: 20,
    large: 24
  }
  
  return (
    <div className="star-rating">
      {[...Array(maxRating)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <ApperIcon
            name="Star"
            size={sizes[size]}
            className={
              index < rating
                ? 'text-accent fill-current'
                : 'text-gray-300'
            }
          />
        </motion.div>
      ))}
      {showCount && (
        <span className="text-sm font-semibold text-gray-600 ml-2">
          ({rating}/{maxRating})
        </span>
      )}
    </div>
  )
}

export default StarRating