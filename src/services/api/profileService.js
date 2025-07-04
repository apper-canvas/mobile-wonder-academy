import mockProfiles from '@/services/mockData/profiles.json'

class ProfileService {
  constructor() {
    this.profiles = [...mockProfiles]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.profiles]
  }
  
  async getById(id) {
    await this.delay(200)
    const profile = this.profiles.find(p => p.Id === parseInt(id))
    if (!profile) {
      throw new Error('Profile not found')
    }
    return { ...profile }
  }
  
  async create(profileData) {
    await this.delay(400)
    const newProfile = {
      Id: this.getNextId(),
      ...profileData,
      totalStars: 0,
      totalCoins: 0,
      createdAt: new Date().toISOString()
    }
    this.profiles.push(newProfile)
    return { ...newProfile }
  }
  
  async update(id, updates) {
    await this.delay(300)
    const index = this.profiles.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Profile not found')
    }
    this.profiles[index] = { ...this.profiles[index], ...updates }
    return { ...this.profiles[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.profiles.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Profile not found')
    }
    this.profiles.splice(index, 1)
    return true
  }
  
  getNextId() {
    return Math.max(...this.profiles.map(p => p.Id), 0) + 1
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const profileService = new ProfileService()