import { gameProgressService } from '@/services/api/gameProgressService'
import { storyProgressService } from '@/services/api/storyProgressService'
import { format, subDays, subWeeks, subMonths, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'

class AnalyticsService {
  constructor() {
    this.gameProgress = []
    this.storyProgress = []
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return
    
    try {
      [this.gameProgress, this.storyProgress] = await Promise.all([
        gameProgressService.getAll(),
        storyProgressService.getAll()
      ])
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize analytics service:', error)
      throw error
    }
  }

  async getDailyProgress(days = 7) {
    await this.initialize()
    const endDate = new Date()
    const startDate = subDays(endDate, days - 1)
    
    const dailyData = []
    
    for (let i = 0; i < days; i++) {
      const currentDate = subDays(endDate, days - 1 - i)
      const dayStart = startOfDay(currentDate)
      const dayEnd = endOfDay(currentDate)
      
      const gamesCompleted = this.gameProgress.filter(progress => {
        const completedAt = new Date(progress.completedAt)
        return isAfter(completedAt, dayStart) && isBefore(completedAt, dayEnd)
      })
      
      const storiesCompleted = this.storyProgress.filter(progress => {
        const completedAt = new Date(progress.createdAt)
        return progress.completed && isAfter(completedAt, dayStart) && isBefore(completedAt, dayEnd)
      })
      
      dailyData.push({
        date: format(currentDate, 'MMM dd'),
        games: gamesCompleted.length,
        stories: storiesCompleted.length,
        totalStars: gamesCompleted.reduce((sum, game) => sum + (game.starsEarned || 0), 0),
        estimatedTime: (gamesCompleted.length * 5) + (storiesCompleted.length * 10) // 5 min per game, 10 min per story
      })
    }
    
    return dailyData
  }

  async getWeeklyProgress(weeks = 4) {
    await this.initialize()
    const endDate = new Date()
    const startDate = subWeeks(endDate, weeks - 1)
    
    const weeklyData = []
    
    for (let i = 0; i < weeks; i++) {
      const weekStart = startOfDay(subWeeks(endDate, weeks - 1 - i))
      const weekEnd = endOfDay(subDays(weekStart, -6))
      
      const gamesCompleted = this.gameProgress.filter(progress => {
        const completedAt = new Date(progress.completedAt)
        return isAfter(completedAt, weekStart) && isBefore(completedAt, weekEnd)
      })
      
      const storiesCompleted = this.storyProgress.filter(progress => {
        const completedAt = new Date(progress.createdAt)
        return progress.completed && isAfter(completedAt, weekStart) && isBefore(completedAt, weekEnd)
      })
      
      weeklyData.push({
        week: `Week ${i + 1}`,
        games: gamesCompleted.length,
        stories: storiesCompleted.length,
        totalStars: gamesCompleted.reduce((sum, game) => sum + (game.starsEarned || 0), 0),
        estimatedTime: (gamesCompleted.length * 5) + (storiesCompleted.length * 10)
      })
    }
    
    return weeklyData
  }

  async getMonthlyProgress(months = 3) {
    await this.initialize()
    const endDate = new Date()
    const startDate = subMonths(endDate, months - 1)
    
    const monthlyData = []
    
    for (let i = 0; i < months; i++) {
      const monthStart = startOfDay(subMonths(endDate, months - 1 - i))
      const monthEnd = endOfDay(subDays(subMonths(monthStart, -1), 1))
      
      const gamesCompleted = this.gameProgress.filter(progress => {
        const completedAt = new Date(progress.completedAt)
        return isAfter(completedAt, monthStart) && isBefore(completedAt, monthEnd)
      })
      
      const storiesCompleted = this.storyProgress.filter(progress => {
        const completedAt = new Date(progress.createdAt)
        return progress.completed && isAfter(completedAt, monthStart) && isBefore(completedAt, monthEnd)
      })
      
      monthlyData.push({
        month: format(monthStart, 'MMM yyyy'),
        games: gamesCompleted.length,
        stories: storiesCompleted.length,
        totalStars: gamesCompleted.reduce((sum, game) => sum + (game.starsEarned || 0), 0),
        estimatedTime: (gamesCompleted.length * 5) + (storiesCompleted.length * 10)
      })
    }
    
    return monthlyData
  }

  async getWorldDistribution() {
    await this.initialize()
    
    const mathGames = this.gameProgress.filter(progress => 
      ['counting', 'addition', 'subtraction', 'multiplication', 'division'].includes(progress.gameId)
    )
    
    const readingGames = this.gameProgress.filter(progress => 
      ['letters', 'words', 'reading', 'phonics', 'vocabulary'].includes(progress.gameId)
    )
    
    const stories = this.storyProgress.filter(progress => progress.completed)
    
    return {
      mathWorld: {
        activities: mathGames.length,
        timeSpent: mathGames.length * 5,
        starsEarned: mathGames.reduce((sum, game) => sum + (game.starsEarned || 0), 0)
      },
      readingLand: {
        activities: readingGames.length + stories.length,
        timeSpent: (readingGames.length * 5) + (stories.length * 10),
        starsEarned: readingGames.reduce((sum, game) => sum + (game.starsEarned || 0), 0)
      }
    }
  }

  async getTopGames(limit = 5) {
    await this.initialize()
    
    const gameStats = {}
    
    this.gameProgress.forEach(progress => {
      if (!gameStats[progress.gameId]) {
        gameStats[progress.gameId] = {
          gameId: progress.gameId,
          timesPlayed: 0,
          totalStars: 0,
          averageStars: 0
        }
      }
      
      gameStats[progress.gameId].timesPlayed++
      gameStats[progress.gameId].totalStars += progress.starsEarned || 0
    })
    
    Object.values(gameStats).forEach(stat => {
      stat.averageStars = Math.round((stat.totalStars / stat.timesPlayed) * 10) / 10
    })
    
    return Object.values(gameStats)
      .sort((a, b) => b.timesPlayed - a.timesPlayed)
      .slice(0, limit)
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const analyticsService = new AnalyticsService()