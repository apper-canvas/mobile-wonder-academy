import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { gameProgressService } from '@/services/api/gameProgressService'
import { storyProgressService } from '@/services/api/storyProgressService'
import { gamesService } from '@/services/api/gamesService'
import { storiesService } from '@/services/api/storiesService'
import ProgressBar from '@/components/atoms/ProgressBar'
import StarRating from '@/components/atoms/StarRating'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'

const MyProgress = () => {
  const [gameProgress, setGameProgress] = useState([])
  const [storyProgress, setStoryProgress] = useState([])
  const [allGames, setAllGames] = useState([])
  const [allStories, setAllStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { currentProfile } = useProfile()
  
  useEffect(() => {
    if (currentProfile) {
      loadProgress()
    }
  }, [currentProfile])
  
  const loadProgress = async () => {
    try {
      setLoading(true)
      setError('')
      const [gameData, storyData, gamesData, storiesData] = await Promise.all([
        gameProgressService.getByProfileId(currentProfile.Id),
        storyProgressService.getByProfileId(currentProfile.Id),
        gamesService.getAll(),
        storiesService.getAll()
      ])
      setGameProgress(gameData)
      setStoryProgress(storyData)
      setAllGames(gamesData)
      setAllStories(storiesData)
    } catch (err) {
      setError('Failed to load your progress')
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (!currentProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-display text-gray-800 mb-4">My Progress</h1>
          <p className="text-gray-600 mb-6">Please select a profile to view progress.</p>
        </div>
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display text-gray-800">My Progress</h1>
        </div>
        <Loading />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Error message={error} onRetry={loadProgress} />
      </div>
    )
  }
  
  // Calculate statistics
  const totalStars = gameProgress.reduce((sum, p) => sum + p.starsEarned, 0)
  const totalGamesPlayed = gameProgress.length
  const totalStoriesRead = storyProgress.filter(p => p.completed).length
  const mathGamesProgress = gameProgress.filter(p => ['counting', 'addition', 'subtraction', 'shapes', 'patterns'].includes(p.gameId))
  const readingGamesProgress = gameProgress.filter(p => ['letters', 'phonics', 'sight-words', 'rhyming', 'vocabulary'].includes(p.gameId))
  
  const mathProgress = (mathGamesProgress.length / 5) * 100
  const readingProgress = (readingGamesProgress.length / 5) * 100
  const overallProgress = (totalGamesPlayed / allGames.length) * 100
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6 }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="TrendingUp" size={48} className="text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          {currentProfile.name}'s Progress
        </h1>
        <p className="text-xl text-gray-600">
          Look how much you've learned! Keep up the amazing work! 🌟
        </p>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-kids text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Star" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-display text-gray-800">{totalStars}</h3>
          <p className="text-gray-600">Total Stars</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-kids text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Gamepad2" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-display text-gray-800">{totalGamesPlayed}</h3>
          <p className="text-gray-600">Games Played</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-kids text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-secondary to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BookOpen" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-display text-gray-800">{totalStoriesRead}</h3>
          <p className="text-gray-600">Stories Read</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-kids text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Trophy" size={32} className="text-white" />
          </div>
          <h3 className="text-3xl font-display text-gray-800">{Math.round(overallProgress)}%</h3>
          <p className="text-gray-600">Overall Progress</p>
        </motion.div>
      </div>
      
      {/* Progress by World */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card-kids"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Calculator" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display text-gray-800">Math World</h3>
              <p className="text-gray-600 text-sm">{mathGamesProgress.length} of 5 games completed</p>
            </div>
          </div>
          <ProgressBar progress={mathProgress} color="primary" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="card-kids"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-pink-500 rounded-full flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-display text-gray-800">Reading Land</h3>
              <p className="text-gray-600 text-sm">{readingGamesProgress.length} of 5 games completed</p>
            </div>
          </div>
          <ProgressBar progress={readingProgress} color="secondary" />
        </motion.div>
      </div>
      
      {/* Recent Activity */}
      <section className="mb-12">
        <h2 className="text-3xl font-display text-gray-800 mb-6">Recent Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameProgress.slice(0, 6).map((progress, index) => {
            const game = allGames.find(g => g.Id === progress.gameId)
            if (!game) return null
            
            return (
              <motion.div
                key={progress.gameId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-kids"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${game.bgColor}`}>
                    <ApperIcon name={game.icon} size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-gray-800">{game.title}</h3>
                    <p className="text-gray-600 text-sm">Level {progress.difficultyLevel}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <StarRating rating={progress.starsEarned} size="small" />
                  <span className="text-xs text-gray-500">{progress.attemptsCount} attempts</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>
      
      {/* Achievements */}
      <section>
        <h2 className="text-3xl font-display text-gray-800 mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Star */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`card-kids ${totalStars >= 1 ? 'bg-gradient-to-br from-accent/10 to-yellow-100' : 'opacity-50'}`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Star" size={32} className="text-white" />
              </div>
              <h3 className="font-display text-gray-800 mb-2">First Star</h3>
              <p className="text-gray-600 text-sm">Earned your very first star!</p>
              {totalStars >= 1 && <div className="text-green-600 font-semibold mt-2">✓ Completed</div>}
            </div>
          </motion.div>
          
          {/* Reading Rookie */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`card-kids ${totalStoriesRead >= 1 ? 'bg-gradient-to-br from-secondary/10 to-pink-100' : 'opacity-50'}`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="BookOpen" size={32} className="text-white" />
              </div>
              <h3 className="font-display text-gray-800 mb-2">Reading Rookie</h3>
              <p className="text-gray-600 text-sm">Read your first story!</p>
              {totalStoriesRead >= 1 && <div className="text-green-600 font-semibold mt-2">✓ Completed</div>}
            </div>
          </motion.div>
          
          {/* Game Master */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`card-kids ${totalGamesPlayed >= 5 ? 'bg-gradient-to-br from-primary/10 to-purple-100' : 'opacity-50'}`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Trophy" size={32} className="text-white" />
              </div>
              <h3 className="font-display text-gray-800 mb-2">Game Master</h3>
              <p className="text-gray-600 text-sm">Played 5 different games!</p>
              {totalGamesPlayed >= 5 && <div className="text-green-600 font-semibold mt-2">✓ Completed</div>}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default MyProgress