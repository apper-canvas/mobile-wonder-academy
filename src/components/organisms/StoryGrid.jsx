import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { storyProgressService } from '@/services/api/storyProgressService'
import StoryCard from '@/components/molecules/StoryCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const StoryGrid = ({ stories }) => {
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { currentProfile } = useProfile()
  
  useEffect(() => {
    if (currentProfile) {
      loadUserProgress()
    }
  }, [currentProfile])
  
  const loadUserProgress = async () => {
    try {
      setLoading(true)
      setError('')
      const progress = await storyProgressService.getByProfileId(currentProfile.Id)
      setUserProgress(progress)
    } catch (err) {
      setError('Failed to load your reading progress')
      console.error('Error loading story progress:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const getUserProgressForStory = (storyId) => {
    return userProgress.find(p => p.storyId === storyId)
  }
  
  if (loading) {
    return <Loading type="stories" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadUserProgress} />
  }
  
  if (!stories || stories.length === 0) {
    return (
      <Empty
        title="No stories available"
        message="We're working on adding more magical stories for you to read!"
        icon="BookOpen"
      />
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <StoryCard
          key={story.Id}
          story={story}
          userProgress={getUserProgressForStory(story.Id)}
        />
      ))}
    </div>
  )
}

export default StoryGrid