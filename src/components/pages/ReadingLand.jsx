import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gamesService } from '@/services/api/gamesService'
import GameGrid from '@/components/organisms/GameGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'

const ReadingLand = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadGames()
  }, [])
  
  const loadGames = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await gamesService.getByType('reading')
      setGames(data)
    } catch (err) {
      setError('Failed to load reading games')
      console.error('Error loading reading games:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BookOpen" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display text-gray-800">Reading Land</h1>
        </div>
        <Loading type="games" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Error message={error} onRetry={loadGames} />
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="w-24 h-24 bg-gradient-to-br from-secondary to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="BookOpen" size={48} className="text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display bg-gradient-to-r from-secondary to-pink-600 bg-clip-text text-transparent mb-4">
          Reading Land
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore the wonderful world of words! Learn letters, sounds, and build your reading skills through exciting adventures.
        </p>
      </div>
      
      {/* Fun Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-kids text-center"
        >
          <div className="text-4xl mb-2">📚</div>
          <h3 className="font-display text-gray-800 mb-2">Books are magical!</h3>
          <p className="text-gray-600 text-sm">Every book takes you on a new adventure to amazing places.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-kids text-center"
        >
          <div className="text-4xl mb-2">🔤</div>
          <h3 className="font-display text-gray-800 mb-2">Letters make words!</h3>
          <p className="text-gray-600 text-sm">When you put letters together, they create words that tell stories.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-kids text-center"
        >
          <div className="text-4xl mb-2">🌟</div>
          <h3 className="font-display text-gray-800 mb-2">You're a reading star!</h3>
          <p className="text-gray-600 text-sm">Every word you read makes you a better reader and learner.</p>
        </motion.div>
      </div>
      
      {/* Games Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display text-gray-800">Choose Your Reading Adventure</h2>
          <div className="flex items-center gap-2 text-secondary">
            <ApperIcon name="Gamepad2" size={24} />
            <span className="font-semibold">{games.length} Games Available</span>
          </div>
        </div>
        
        <GameGrid games={games} worldType="reading" />
      </section>
    </div>
  )
}

export default ReadingLand