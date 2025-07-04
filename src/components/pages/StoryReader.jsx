import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { storiesService } from '@/services/api/storiesService'
import { storyProgressService } from '@/services/api/storyProgressService'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const StoryReader = () => {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const { currentProfile } = useProfile()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isReading, setIsReading] = useState(false)
  const [highlightedWord, setHighlightedWord] = useState(null)
  
  useEffect(() => {
    loadStory()
  }, [storyId])
  
  useEffect(() => {
    if (story && currentProfile) {
      saveProgress()
    }
  }, [currentPage, story, currentProfile])
  
  const loadStory = async () => {
    try {
      setLoading(true)
      setError('')
      const storyData = await storiesService.getById(storyId)
      setStory(storyData)
      
      // Load user progress
      if (currentProfile) {
        const progress = await storyProgressService.getByProfileId(currentProfile.Id)
        const storyProgress = progress.find(p => p.storyId === storyId)
        if (storyProgress) {
          setCurrentPage(storyProgress.currentPage || 1)
        }
      }
    } catch (err) {
      setError('Failed to load story')
      console.error('Error loading story:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const saveProgress = async () => {
    if (!currentProfile || !story) return
    
    try {
      const isCompleted = currentPage >= story.pages.length
      
      await storyProgressService.create({
        profileId: currentProfile.Id,
        storyId: storyId,
        currentPage: currentPage,
        completed: isCompleted
      })
      
      if (isCompleted) {
        toast.success('Story completed! Great reading! 📚')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }
  
  const handleWordClick = (word) => {
    setHighlightedWord(word)
    // Simulate text-to-speech
    toast.info(`"${word}" - Great word choice!`)
    setTimeout(() => setHighlightedWord(null), 2000)
  }
  
  const renderTextWithHighlight = (text) => {
    const words = text.split(' ')
    return words.map((word, index) => (
      <span
        key={index}
        onClick={() => handleWordClick(word)}
        className={`
          cursor-pointer hover:bg-yellow-200 rounded px-1 transition-colors
          ${highlightedWord === word ? 'bg-yellow-300' : ''}
        `}
      >
        {word}{' '}
      </span>
    ))
  }
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Loading />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Error message={error} onRetry={loadStory} />
      </div>
    )
  }
  
  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Error message="Story not found" onRetry={() => navigate(-1)} />
      </div>
    )
  }
  
  const currentPageData = story.pages[currentPage - 1]
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white rounded-full shadow-button flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ApperIcon name="ArrowLeft" size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-display text-gray-800">{story.title}</h1>
            <p className="text-gray-600">Page {currentPage} of {story.pages.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" size={16} className="text-gray-500" />
            <span className="text-sm text-gray-500">{story.readTime}</span>
          </div>
          <button
            onClick={() => setIsReading(!isReading)}
            className="btn-accent text-sm"
          >
            <ApperIcon name={isReading ? 'Pause' : 'Play'} size={16} />
            {isReading ? 'Pause' : 'Read Aloud'}
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-purple-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / story.pages.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Story Content */}
      <div className="card-kids max-w-3xl mx-auto">
        {currentPageData && (
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Story Illustration */}
            <div className={`w-full h-64 rounded-2xl mb-6 flex items-center justify-center ${story.coverColor}`}>
              <div className="text-center text-white">
                <ApperIcon name={story.icon} size={64} className="mx-auto mb-4" />
                <h2 className="text-xl font-display">{currentPageData.title}</h2>
              </div>
            </div>
            
            {/* Story Text */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-gray-800 font-medium">
                {renderTextWithHighlight(currentPageData.text)}
              </p>
              
              {/* Word of the Day */}
              {currentPageData.vocabulary && (
                <div className="bg-gradient-to-r from-accent/10 to-yellow-100 rounded-2xl p-4 mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name="Lightbulb" size={20} className="text-accent" />
                    <h3 className="font-display text-gray-800">Word of the Day</h3>
                  </div>
                  <p className="text-gray-700">
                    <strong>{currentPageData.vocabulary.word}</strong> - {currentPageData.vocabulary.definition}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          variant="outline"
          icon="ChevronLeft"
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {story.pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`
                w-3 h-3 rounded-full transition-colors
                ${currentPage === index + 1 ? 'bg-primary' : 'bg-gray-300'}
              `}
            />
          ))}
        </div>
        
        {currentPage < story.pages.length ? (
          <Button
            onClick={() => setCurrentPage(Math.min(story.pages.length, currentPage + 1))}
            icon="ChevronRight"
            iconPosition="right"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => navigate('/stories')}
            variant="accent"
            icon="BookOpen"
          >
            More Stories
          </Button>
        )}
      </div>
    </div>
  )
}

export default StoryReader