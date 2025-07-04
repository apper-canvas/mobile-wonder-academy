import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const StoryCard = ({ story, userProgress }) => {
  const navigate = useNavigate()
  
  const handleRead = () => {
    navigate(`/story/${story.Id}`)
  }
  
  const isCompleted = userProgress?.completed || false
  const currentPage = userProgress?.currentPage || 1
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleRead}
      className="card-kids cursor-pointer relative overflow-hidden"
    >
      {/* Story Cover */}
      <div className={`w-full h-48 rounded-xl mb-4 flex items-center justify-center ${story.coverColor}`}>
        <div className="text-center text-white">
          <ApperIcon name={story.icon} size={48} className="mx-auto mb-2" />
          <h3 className="text-xl font-display">{story.title}</h3>
        </div>
      </div>
      
      {/* Story Info */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{story.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ApperIcon name="Clock" size={14} />
          <span>{story.readTime}</span>
          <ApperIcon name="BookOpen" size={14} />
          <span>{story.pages} pages</span>
        </div>
        
        {/* Progress */}
        {userProgress && (
          <div className="pt-2">
            {isCompleted ? (
              <div className="flex items-center gap-2 text-success">
                <ApperIcon name="CheckCircle" size={16} />
                <span className="text-sm font-semibold">Completed!</span>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                Page {currentPage} of {story.pages}
              </div>
            )}
          </div>
        )}
        
        {/* Read Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary w-full mt-3"
        >
          {isCompleted ? 'Read Again' : userProgress ? 'Continue' : 'Start Reading'}
        </motion.button>
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

export default StoryCard