import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import StarRating from '@/components/atoms/StarRating'
import ApperIcon from '@/components/ApperIcon'

const GameCard = ({ game, userProgress }) => {
  const navigate = useNavigate()
  
  const handlePlay = () => {
    navigate(`/game/${game.Id}`)
  }
  
  const userStars = userProgress?.starsEarned || 0
  const isCompleted = userStars > 0
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePlay}
      className="game-card relative overflow-hidden"
    >
      {/* Game Icon/Image */}
      <div className={`w-full h-32 rounded-xl mb-4 flex items-center justify-center text-4xl ${game.bgColor}`}>
        <ApperIcon name={game.icon} size={48} className="text-white" />
      </div>
      
      {/* Game Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-display text-gray-800">{game.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{game.description}</p>
        
        {/* Progress and Play Button */}
        <div className="flex items-center justify-between pt-2">
          <StarRating rating={userStars} maxRating={3} size="small" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn-accent text-sm py-2 px-4 min-w-0"
          >
            {isCompleted ? 'Play Again' : 'Play'}
          </motion.button>
        </div>
      </div>
      
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-success rounded-full p-2">
          <ApperIcon name="Check" size={16} className="text-white" />
        </div>
      )}
    </motion.div>
  )
}

export default GameCard