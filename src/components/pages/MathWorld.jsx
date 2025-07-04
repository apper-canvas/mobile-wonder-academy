import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gamesService } from '@/services/api/gamesService'
import GameGrid from '@/components/organisms/GameGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'

const MathWorld = () => {
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
      const data = await gamesService.getByType('math')
      setGames(data)
    } catch (err) {
      setError('Failed to load math games')
      console.error('Error loading math games:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Calculator" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display text-gray-800">Math World</h1>
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
          className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="Calculator" size={48} className="text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          Math World
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the magic of numbers! Practice counting, addition, subtraction, and more through fun games and activities.
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
          <div className="text-4xl mb-2">🔢</div>
          <h3 className="font-display text-gray-800 mb-2">Numbers are everywhere!</h3>
          <p className="text-gray-600 text-sm">From counting toys to measuring cookies, math is all around us.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-kids text-center"
        >
          <div className="text-4xl mb-2">🧮</div>
          <h3 className="font-display text-gray-800 mb-2">Practice makes perfect!</h3>
          <p className="text-gray-600 text-sm">The more you play, the stronger your math skills become.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-kids text-center"
        >
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="font-display text-gray-800 mb-2">Have fun learning!</h3>
          <p className="text-gray-600 text-sm">Math is like a game - the more you play, the more fun it becomes!</p>
        </motion.div>
      </div>
      
      {/* Games Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display text-gray-800">Choose Your Math Adventure</h2>
          <div className="flex items-center gap-2 text-blue-600">
            <ApperIcon name="Gamepad2" size={24} />
            <span className="font-semibold">{games.length} Games Available</span>
          </div>
        </div>
        
        <GameGrid games={games} worldType="math" />
      </section>
    </div>
  )
}

export default MathWorld