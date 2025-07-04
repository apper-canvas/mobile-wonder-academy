import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import { gamesService } from '@/services/api/gamesService'
import { gameProgressService } from '@/services/api/gameProgressService'
import { rewardsService } from '@/services/api/rewardsService'
import RewardModal from '@/components/molecules/RewardModal'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const GamePlay = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { currentProfile } = useProfile()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [gameState, setGameState] = useState({
    currentQuestion: 0,
    score: 0,
    lives: 3,
    questions: [],
    isPlaying: false,
    isComplete: false,
    selectedAnswer: null,
    showFeedback: false,
    difficultyLevel: 1
  })
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [earnedRewards, setEarnedRewards] = useState({ stars: 0, coins: 0 })
  
  useEffect(() => {
    loadGame()
  }, [gameId])
  
  const loadGame = async () => {
    try {
      setLoading(true)
      setError('')
      const gameData = await gamesService.getById(gameId)
      setGame(gameData)
      generateQuestions(gameData)
    } catch (err) {
      setError('Failed to load game')
      console.error('Error loading game:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const generateQuestions = (gameData) => {
    const questions = []
    const questionCount = 5
    
    for (let i = 0; i < questionCount; i++) {
      if (gameData.type === 'math') {
        questions.push(generateMathQuestion(gameData.Id))
      } else {
        questions.push(generateReadingQuestion(gameData.Id))
      }
    }
    
    setGameState(prev => ({
      ...prev,
      questions,
      isPlaying: true
    }))
  }
  
const generateMathQuestion = (gameId) => {
    switch (gameId) {
      case 'counting': {
        const countNum = Math.floor(Math.random() * 10) + 1
        return {
          question: `How many stars do you see? ${'⭐'.repeat(countNum)}`,
          options: [countNum - 1, countNum, countNum + 1, countNum + 2].filter(n => n > 0),
          correct: countNum,
          type: 'multiple-choice'
        }
      }
      case 'addition': {
        const a = Math.floor(Math.random() * 5) + 1
        const b = Math.floor(Math.random() * 5) + 1
        return {
          question: `What is ${a} + ${b}?`,
          options: [a + b - 1, a + b, a + b + 1, a + b + 2].filter(n => n > 0),
          correct: a + b,
          type: 'multiple-choice'
        }
      }
      case 'subtraction': {
        const c = Math.floor(Math.random() * 5) + 5
        const d = Math.floor(Math.random() * 5) + 1
        return {
          question: `What is ${c} - ${d}?`,
          options: [c - d - 1, c - d, c - d + 1, c - d + 2].filter(n => n >= 0),
          correct: c - d,
          type: 'multiple-choice'
        }
      }
      case 'shapes': {
        const shapes = ['circle', 'square', 'triangle', 'rectangle']
        const shape = shapes[Math.floor(Math.random() * shapes.length)]
        return {
          question: `What shape is this? ${shape === 'circle' ? '⭕' : shape === 'square' ? '⬜' : shape === 'triangle' ? '🔺' : '📐'}`,
          options: shapes,
          correct: shape,
          type: 'multiple-choice'
        }
      }
      case 'patterns': {
        const pattern = ['🔴', '🔵', '🔴', '🔵', '❓']
        return {
          question: `What comes next in this pattern? ${pattern.join(' ')}`,
          options: ['🔴', '🔵', '🟡', '🟢'],
          correct: '🔴',
          type: 'multiple-choice'
        }
      }
      default:
        return {
          question: 'What is 1 + 1?',
          options: [1, 2, 3, 4],
          correct: 2,
          type: 'multiple-choice'
        }
    }
  }
  
const generateReadingQuestion = (gameId) => {
    switch (gameId) {
      case 'letters': {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        const letter = letters[Math.floor(Math.random() * letters.length)]
        return {
          question: `Which letter is this? ${letter}`,
          options: [letter, letters[(letters.indexOf(letter) + 1) % letters.length], letters[(letters.indexOf(letter) + 2) % letters.length], letters[(letters.indexOf(letter) + 3) % letters.length]],
          correct: letter,
          type: 'multiple-choice'
        }
      }
      case 'phonics': {
        const sounds = [
          { letter: 'B', sound: 'buh', word: 'ball' },
          { letter: 'C', sound: 'kuh', word: 'cat' },
          { letter: 'D', sound: 'duh', word: 'dog' },
          { letter: 'F', sound: 'fuh', word: 'fish' }
        ]
        const sound = sounds[Math.floor(Math.random() * sounds.length)]
        return {
          question: `What sound does the letter "${sound.letter}" make?`,
          options: [sound.sound, 'tuh', 'puh', 'muh'],
          correct: sound.sound,
          type: 'multiple-choice'
        }
      }
      case 'sight-words': {
        const words = ['the', 'and', 'you', 'see', 'can', 'go', 'me', 'up']
        const word = words[Math.floor(Math.random() * words.length)]
        return {
          question: `Which word is "${word}"?`,
          options: [word, words[(words.indexOf(word) + 1) % words.length], words[(words.indexOf(word) + 2) % words.length], words[(words.indexOf(word) + 3) % words.length]],
          correct: word,
          type: 'multiple-choice'
        }
      }
      case 'rhyming': {
        const rhymes = [
          { word: 'cat', options: ['hat', 'dog', 'car', 'run'] },
          { word: 'sun', options: ['fun', 'moon', 'star', 'tree'] },
          { word: 'ball', options: ['wall', 'book', 'fish', 'bird'] }
        ]
        const rhyme = rhymes[Math.floor(Math.random() * rhymes.length)]
        return {
          question: `Which word rhymes with "${rhyme.word}"?`,
          options: rhyme.options,
          correct: rhyme.options[0],
          type: 'multiple-choice'
        }
      }
      case 'vocabulary': {
        const vocab = [
          { word: 'happy', definition: 'feeling good and joyful' },
          { word: 'big', definition: 'large in size' },
          { word: 'fast', definition: 'moving quickly' }
        ]
        const vocabItem = vocab[Math.floor(Math.random() * vocab.length)]
        return {
          question: `What does "${vocabItem.word}" mean?`,
          options: [vocabItem.definition, 'small in size', 'moving slowly', 'feeling sad'],
          correct: vocabItem.definition,
          type: 'multiple-choice'
        }
      }
      default:
        return {
          question: 'What letter comes after A?',
          options: ['B', 'C', 'D', 'E'],
          correct: 'B',
          type: 'multiple-choice'
        }
    }
  }
  
  const handleAnswerSelect = (answer) => {
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true
    }))
    
    setTimeout(() => {
      const currentQuestion = gameState.questions[gameState.currentQuestion]
      const isCorrect = answer === currentQuestion.correct
      
      if (isCorrect) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 1,
          selectedAnswer: null,
          showFeedback: false
        }))
        toast.success('Correct! Great job! 🌟')
      } else {
        setGameState(prev => ({
          ...prev,
          lives: prev.lives - 1,
          selectedAnswer: null,
          showFeedback: false
        }))
        toast.error('Try again! You can do it! 💪')
      }
      
      // Move to next question or end game
      setTimeout(() => {
        if (gameState.currentQuestion + 1 >= gameState.questions.length || gameState.lives <= 1) {
          endGame()
        } else {
          setGameState(prev => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1
          }))
        }
      }, 1000)
    }, 1500)
  }
  
  const endGame = async () => {
    const finalScore = gameState.score
    const stars = Math.min(3, Math.max(1, finalScore))
    const coins = stars * 10
    
    setGameState(prev => ({
      ...prev,
      isComplete: true,
      isPlaying: false
    }))
    
    // Save progress
    try {
      await gameProgressService.create({
        profileId: currentProfile.Id,
        gameId: gameId,
        starsEarned: stars,
        attemptsCount: 1,
        difficultyLevel: gameState.difficultyLevel,
        completedAt: new Date().toISOString()
      })
      
      // Update rewards
      await rewardsService.update(currentProfile.Id, {
        totalStars: (currentProfile.totalStars || 0) + stars,
        totalCoins: (currentProfile.totalCoins || 0) + coins
      })
      
      setEarnedRewards({ stars, coins })
      setShowRewardModal(true)
    } catch (error) {
      console.error('Error saving progress:', error)
      toast.error('Failed to save progress')
    }
  }
  
  const handleRestart = () => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      lives: 3,
      questions: [],
      isPlaying: false,
      isComplete: false,
      selectedAnswer: null,
      showFeedback: false,
      difficultyLevel: 1
    })
    generateQuestions(game)
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
        <Error message={error} onRetry={loadGame} />
      </div>
    )
  }
  
  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Error message="Game not found" onRetry={() => navigate(-1)} />
      </div>
    )
  }
  
  const currentQuestion = gameState.questions[gameState.currentQuestion]
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white rounded-full shadow-button flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ApperIcon name="ArrowLeft" size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-display text-gray-800">{game.title}</h1>
            <p className="text-gray-600">{game.description}</p>
          </div>
        </div>
        
        {gameState.isPlaying && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ApperIcon name="Heart" size={20} className="text-red-500" />
              <span className="font-semibold text-gray-700">×{gameState.lives}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Trophy" size={20} className="text-accent" />
              <span className="font-semibold text-gray-700">{gameState.score}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Game Content */}
      <div className="card-kids max-w-2xl mx-auto">
        {!gameState.isPlaying && !gameState.isComplete && (
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${game.bgColor}`}>
              <ApperIcon name={game.icon} size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-display text-gray-800 mb-4">Ready to Play?</h2>
            <p className="text-gray-600 mb-8">{game.instructions}</p>
            <Button onClick={() => generateQuestions(game)} className="text-lg">
              Start Game
            </Button>
          </div>
        )}
        
        {gameState.isPlaying && currentQuestion && (
          <div>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">Progress</span>
                <span className="text-sm font-semibold text-primary">
                  {gameState.currentQuestion + 1} / {gameState.questions.length}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((gameState.currentQuestion + 1) / gameState.questions.length) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display text-gray-800 mb-6">
                {currentQuestion.question}
              </h2>
              
              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={gameState.showFeedback}
                    className={`
                      p-4 rounded-2xl font-semibold text-lg transition-all duration-200
                      ${gameState.showFeedback && option === currentQuestion.correct
                        ? 'bg-success text-white'
                        : gameState.showFeedback && option === gameState.selectedAnswer && option !== currentQuestion.correct
                        ? 'bg-error text-white'
                        : 'bg-white border-2 border-purple-200 hover:border-primary hover:text-primary'
                      }
                    `}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {gameState.isComplete && (
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Trophy" size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-display text-gray-800 mb-4">Game Complete!</h2>
            <p className="text-gray-600 mb-6">
              You got {gameState.score} out of {gameState.questions.length} questions correct!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRestart} variant="outline">
                Play Again
              </Button>
              <Button onClick={() => navigate(-1)}>
                Back to Games
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Reward Modal */}
      <RewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        stars={earnedRewards.stars}
        coins={earnedRewards.coins}
      />
    </div>
  )
}

export default GamePlay