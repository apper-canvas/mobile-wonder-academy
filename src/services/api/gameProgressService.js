import mockGameProgress from '@/services/mockData/gameProgress.json'

class GameProgressService {
  constructor() {
    this.gameProgress = [...mockGameProgress]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.gameProgress]
  }
  
  async getById(id) {
    await this.delay(200)
    const progress = this.gameProgress.find(p => p.Id === parseInt(id))
    if (!progress) {
      throw new Error('Game progress not found')
    }
    return { ...progress }
  }
  
  async getByProfileId(profileId) {
    await this.delay(300)
    return this.gameProgress.filter(p => p.profileId === profileId)
  }
  
  async create(progressData) {
    await this.delay(400)
    const newProgress = {
      Id: this.getNextId(),
      ...progressData,
      createdAt: new Date().toISOString()
    }
    this.gameProgress.push(newProgress)
    return { ...newProgress }
  }
  
  async update(id, updates) {
    await this.delay(300)
    const index = this.gameProgress.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Game progress not found')
    }
    this.gameProgress[index] = { ...this.gameProgress[index], ...updates }
    return { ...this.gameProgress[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.gameProgress.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Game progress not found')
    }
    this.gameProgress.splice(index, 1)
    return true
  }
  
  getNextId() {
    return Math.max(...this.gameProgress.map(p => p.Id), 0) + 1
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const gameProgressService = new GameProgressService()