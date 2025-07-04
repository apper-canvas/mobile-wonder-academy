import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { storiesService } from '@/services/api/storiesService'
import StoryGrid from '@/components/organisms/StoryGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'

const Stories = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadStories()
  }, [])
  
  const loadStories = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await storiesService.getAll()
      setStories(data)
    } catch (err) {
      setError('Failed to load stories')
      console.error('Error loading stories:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Book" size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-display text-gray-800">Story Library</h1>
        </div>
        <Loading type="stories" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Error message={error} onRetry={loadStories} />
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
          className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="Book" size={48} className="text-white" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-display bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
          Story Library
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Dive into magical tales and exciting adventures! Read along with interactive stories that help you learn new words and sounds.
        </p>
      </div>
      
      {/* Reading Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card-kids"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Volume2" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-display text-gray-800 mb-1">Listen & Learn</h3>
              <p className="text-gray-600 text-sm">Tap any word to hear how it sounds!</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-kids"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Repeat" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-display text-gray-800 mb-1">Read Again</h3>
              <p className="text-gray-600 text-sm">You can read your favorite stories as many times as you want!</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Stories Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-display text-gray-800">Choose Your Story Adventure</h2>
          <div className="flex items-center gap-2 text-purple-600">
            <ApperIcon name="BookOpen" size={24} />
            <span className="font-semibold">{stories.length} Stories Available</span>
          </div>
        </div>
        
        <StoryGrid stories={stories} />
      </section>
    </div>
  )
}

export default Stories