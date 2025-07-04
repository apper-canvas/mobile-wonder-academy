import mockRewards from '@/services/mockData/rewards.json'

class RewardsService {
  constructor() {
    this.rewards = [...mockRewards]
  }
  
  async getAll() {
    await this.delay(300)
    return [...this.rewards]
  }
  
  async getById(id) {
    await this.delay(200)
    const reward = this.rewards.find(r => r.Id === parseInt(id))
    if (!reward) {
      throw new Error('Reward not found')
    }
    return { ...reward }
  }
  
  async getByProfileId(profileId) {
    await this.delay(300)
    return this.rewards.find(r => r.profileId === profileId) || {
      profileId: profileId,
      totalStars: 0,
      totalCoins: 0,
      unlockedBadges: []
    }
  }
  
  async create(rewardData) {
    await this.delay(400)
    const newReward = {
      Id: this.getNextId(),
      ...rewardData,
      createdAt: new Date().toISOString()
    }
    this.rewards.push(newReward)
    return { ...newReward }
  }
  
  async update(profileId, updates) {
    await this.delay(300)
    const index = this.rewards.findIndex(r => r.profileId === profileId)
    if (index === -1) {
      // Create new reward entry
      const newReward = {
        Id: this.getNextId(),
        profileId: profileId,
        ...updates,
        createdAt: new Date().toISOString()
      }
      this.rewards.push(newReward)
      return { ...newReward }
    }
    
    this.rewards[index] = { ...this.rewards[index], ...updates }
    return { ...this.rewards[index] }
  }
  
  async delete(id) {
    await this.delay(200)
    const index = this.rewards.findIndex(r => r.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Reward not found')
    }
    this.rewards.splice(index, 1)
    return true
  }
  
  getNextId() {
    return Math.max(...this.rewards.map(r => r.Id), 0) + 1
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const rewardsService = new RewardsService()