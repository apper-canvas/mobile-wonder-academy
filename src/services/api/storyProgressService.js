import mockStoryProgress from '@/services/mockData/storyProgress.json'

class StoryProgressService {
  constructor() {
    this.storyProgress = [...mockStoryProgress]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.storyProgress]
  }
  
  async getById(id) {
    await this.delay(200)
    const progress = this.storyProgress.find(p => p.Id === parseInt(id))
    if (!progress) {
      throw new Error('Story progress not found')
    }
    return { ...progress }
  }
  
  async getByProfileId(profileId) {
    await this.delay(300)
    return this.storyProgress.filter(p => p.profileId === profileId)
  }
  
  async create(progressData) {
    await this.delay(400)
    const existingIndex = this.storyProgress.findIndex(p => 
      p.profileId === progressData.profileId && p.storyId === progressData.storyId
    )
    
    if (existingIndex !== -1) {
      // Update existing progress
      this.storyProgress[existingIndex] = { ...this.storyProgress[existingIndex], ...progressData }
      return { ...this.storyProgress[existingIndex] }
    }
    
    // Create new progress
    const newProgress = {
      Id: this.getNextId(),
      ...progressData,
      createdAt: new Date().toISOString()
    }
    this.storyProgress.push(newProgress)
    return { ...newProgress }
  }
  
  async update(id, updates) {
    await this.delay(300)
    const index = this.storyProgress.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Story progress not found')
    }
    this.storyProgress[index] = { ...this.storyProgress[index], ...updates }
    return { ...this.storyProgress[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.storyProgress.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Story progress not found')
    }
    this.storyProgress.splice(index, 1)
    return true
  }
  
  getNextId() {
    return Math.max(...this.storyProgress.map(p => p.Id), 0) + 1
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const storyProgressService = new StoryProgressService()