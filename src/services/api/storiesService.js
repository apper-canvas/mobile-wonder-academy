import mockStories from '@/services/mockData/stories.json'

class StoriesService {
  constructor() {
    this.stories = [...mockStories]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.stories]
  }
  
  async getById(id) {
    await this.delay(200)
    const story = this.stories.find(s => s.Id === id)
    if (!story) {
      throw new Error('Story not found')
    }
    return { ...story }
  }
  
  async create(storyData) {
    await this.delay(400)
    const newStory = {
      Id: this.getNextId(),
      ...storyData,
      createdAt: new Date().toISOString()
    }
    this.stories.push(newStory)
    return { ...newStory }
  }
  
  async update(id, updates) {
    await this.delay(300)
    const index = this.stories.findIndex(s => s.Id === id)
    if (index === -1) {
      throw new Error('Story not found')
    }
    this.stories[index] = { ...this.stories[index], ...updates }
    return { ...this.stories[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.stories.findIndex(s => s.Id === id)
    if (index === -1) {
      throw new Error('Story not found')
    }
    this.stories.splice(index, 1)
    return true
  }
  
  getNextId() {
    return Math.max(...this.stories.map(s => s.Id), 0) + 1
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const storiesService = new StoriesService()