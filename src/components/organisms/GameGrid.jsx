import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { gameProgressService } from '@/services/api/gameProgressService'
import GameCard from '@/components/molecules/GameCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const GameGrid = ({ games, worldType }) => {
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
      const progress = await gameProgressService.getByProfileId(currentProfile.Id)
      setUserProgress(progress)
    } catch (err) {
      setError('Failed to load your progress')
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const getUserProgressForGame = (gameId) => {
    return userProgress.find(p => p.gameId === gameId)
  }
  
  if (loading) {
    return <Loading type="games" />
  }
  
  if (error) {
    return <Error message={error} onRetry={loadUserProgress} />
  }
  
  if (!games || games.length === 0) {
    return (
      <Empty
        title="No games available"
        message={`We're working on adding more ${worldType} games for you!`}
        icon="GamepadIcon"
      />
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard
          key={game.Id}
          game={game}
          userProgress={getUserProgressForGame(game.Id)}
        />
      ))}
    </div>
  )
}

export default GameGrid