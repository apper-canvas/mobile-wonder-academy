import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const WorldPortal = ({ world, userProgress }) => {
  const navigate = useNavigate()
  
  const handleEnterWorld = () => {
    navigate(world.path)
  }
  
  const completedGames = userProgress?.filter(p => p.starsEarned > 0).length || 0
  const totalGames = world.gameCount || 5
  const progressPercentage = (completedGames / totalGames) * 100
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleEnterWorld}
      className={`world-portal ${world.className} relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-white rounded-full"></div>
        <div className="absolute top-1/2 right-8 w-4 h-4 bg-white rounded-full"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <ApperIcon name={world.icon} size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-display text-white">{world.title}</h2>
            <p className="text-white/90 text-sm">{world.description}</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-white/90 text-sm">
            <span>Games Completed</span>
            <span>{completedGames}/{totalGames}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
        
        {/* Enter Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-4 bg-white text-primary font-semibold py-2 px-6 rounded-full hover:bg-white/90 transition-colors"
        >
          Enter World
        </motion.button>
      </div>
    </motion.div>
  )
}

export default WorldPortal