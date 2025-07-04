import mockGames from '@/services/mockData/games.json'

class GamesService {
  constructor() {
    this.games = [...mockGames]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.games]
  }
  
  async getById(id) {
    await this.delay(200)
    const game = this.games.find(g => g.Id === id)
    if (!game) {
      throw new Error('Game not found')
    }
    return { ...game }
  }
  
  async getByType(type) {
    await this.delay(300)
    return this.games.filter(g => g.type === type)
  }
  
  async create(gameData) {
    await this.delay(400)
    const newGame = {
      Id: this.getNextId(),
      ...gameData,
      createdAt: new Date().toISOString()
    }
    this.games.push(newGame)
    return { ...newGame }
  }
  
  async update(id, updates) {
    await this.delay(300)
    const index = this.games.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Game not found')
    }
    this.games[index] = { ...this.games[index], ...updates }
    return { ...this.games[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.games.findIndex(g => g.Id === id)
    if (index === -1) {
      throw new Error('Game not found')
    }
    this.games.splice(index, 1)
    return true
  }
  
  getNextId() {
    return Math.max(...this.games.map(g => g.Id), 0) + 1
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const gamesService = new GamesService()