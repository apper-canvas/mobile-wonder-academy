import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const RewardModal = ({ isOpen, onClose, stars, coins, isNewRecord = false }) => {
  const [showConfetti, setShowConfetti] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
          >
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 1 }}
                    animate={{ 
                      y: 400,
                      x: Math.random() * 200 - 100,
                      rotate: Math.random() * 360,
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 3,
                      delay: Math.random() * 0.5,
                      ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 bg-accent rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      backgroundColor: ['#FFC857', '#FF6B9D', '#6B5BCD'][Math.floor(Math.random() * 3)]
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Celebration Icon */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center"
            >
              <ApperIcon name="Trophy" size={40} className="text-white" />
            </motion.div>
            
            {/* Title */}
            <h2 className="text-3xl font-display text-gray-800 mb-2">
              {isNewRecord ? 'New Record!' : 'Great Job!'}
            </h2>
            <p className="text-gray-600 mb-6">You earned awesome rewards!</p>
            
            {/* Rewards */}
            <div className="flex justify-center gap-8 mb-6">
              {/* Stars */}
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(stars)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 0.3 }}
                    >
                      <ApperIcon name="Star" size={24} className="text-accent fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {stars} Star{stars !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Coins */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  className="w-12 h-12 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2"
                >
                  <span className="text-white font-bold text-lg">{coins}</span>
                </motion.div>
                <p className="text-sm font-semibold text-gray-700">
                  {coins} Coin{coins !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {/* Continue Button */}
            <Button onClick={onClose} className="w-full">
              Continue Learning!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RewardModal