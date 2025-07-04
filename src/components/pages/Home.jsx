import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { gameProgressService } from '@/services/api/gameProgressService'
import { storyProgressService } from '@/services/api/storyProgressService'
import WorldPortal from '@/components/molecules/WorldPortal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ProgressBar from '@/components/atoms/ProgressBar'
import ApperIcon from '@/components/ApperIcon'
import { motion } from 'framer-motion'

const Home = () => {
  const [gameProgress, setGameProgress] = useState([])
  const [storyProgress, setStoryProgress] = useState([])
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
      const [gameData, storyData] = await Promise.all([
        gameProgressService.getByProfileId(currentProfile.Id),
        storyProgressService.getByProfileId(currentProfile.Id)
      ])
      setGameProgress(gameData)
      setStoryProgress(storyData)
    } catch (err) {
      setError('Failed to load your progress')
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const worlds = [
    {
      id: 'math',
      title: 'Math World',
      description: 'Numbers, counting, and problem solving',
      icon: 'Calculator',
      path: '/math-world',
      className: 'math-world',
      gameCount: 5
    },
    {
      id: 'reading',
      title: 'Reading Land',
      description: 'Letters, words, and storytelling',
      icon: 'BookOpen',
      path: '/reading-land',
      className: 'reading-world',
      gameCount: 5
    }
  ]
  
  const getProgressForWorld = (worldId) => {
    return gameProgress.filter(p => 
      (worldId === 'math' && ['counting', 'addition', 'subtraction', 'shapes', 'patterns'].includes(p.gameId)) ||
      (worldId === 'reading' && ['letters', 'phonics', 'sight-words', 'rhyming', 'vocabulary'].includes(p.gameId))
    )
  }
  
  const totalStars = gameProgress.reduce((sum, p) => sum + p.starsEarned, 0)
  const totalCoins = gameProgress.length * 10 // 10 coins per completed game
  const completedStories = storyProgress.filter(p => p.completed).length
  
  if (!currentProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-display text-gray-800 mb-4">Welcome to Wonder Academy!</h1>
          <p className="text-gray-600 mb-6">Please select a profile to start your learning adventure.</p>
          <button
            onClick={() => window.location.href = '/profile'}
            className="btn-primary"
          >
            Choose Profile
          </button>
        </div>
      </div>
    )
  }
  
  if (loading) {
    return <Loading />
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Error message={error} onRetry={loadProgress} />
      </div>
    )
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4"
        >
          Welcome back, {currentProfile.name}! 🌟
        </motion.h1>
        <p className="text-xl text-gray-600 mb-8">
          Ready for another amazing learning adventure?
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-kids text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Star" size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-display text-gray-800">{totalStars}</h3>
            <p className="text-gray-600">Stars Earned</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-kids text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Gamepad2" size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-display text-gray-800">{gameProgress.length}</h3>
            <p className="text-gray-600">Games Played</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-kids text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="BookOpen" size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-display text-gray-800">{completedStories}</h3>
            <p className="text-gray-600">Stories Read</p>
          </motion.div>
        </div>
      </div>
      
      {/* Learning Worlds */}
      <section className="mb-12">
        <h2 className="text-3xl font-display text-gray-800 text-center mb-8">
          Choose Your Learning World
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {worlds.map((world, index) => (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <WorldPortal 
                world={world} 
                userProgress={getProgressForWorld(world.id)}
              />
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Daily Goals */}
      <section className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-kids"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display text-gray-800">Today's Goals</h2>
            <div className="flex items-center gap-2 text-primary">
              <ApperIcon name="Target" size={24} />
              <span className="font-semibold">Daily Challenge</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Play 2 games</span>
                <span className="text-sm text-gray-500">{Math.min(gameProgress.length, 2)}/2</span>
              </div>
              <ProgressBar 
                progress={Math.min((gameProgress.length / 2) * 100, 100)} 
                showLabel={false}
                size="small"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Read 1 story</span>
                <span className="text-sm text-gray-500">{Math.min(completedStories, 1)}/1</span>
              </div>
              <ProgressBar 
                progress={Math.min((completedStories / 1) * 100, 100)} 
                showLabel={false}
                size="small"
                color="secondary"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">Earn 3 stars</span>
                <span className="text-sm text-gray-500">{Math.min(totalStars, 3)}/3</span>
              </div>
              <ProgressBar 
                progress={Math.min((totalStars / 3) * 100, 100)} 
                showLabel={false}
                size="small"
                color="accent"
              />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home