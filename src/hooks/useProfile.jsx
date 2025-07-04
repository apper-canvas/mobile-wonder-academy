import { createContext, useContext, useState, useEffect } from 'react'
import { profileService } from '@/services/api/profileService'

const ProfileContext = createContext()

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export const ProfileProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      setLoading(true)
      const data = await profileService.getAll()
      setProfiles(data)
      
      // Set first profile as current if none selected
      if (data.length > 0 && !currentProfile) {
        setCurrentProfile(data[0])
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (profileData) => {
    try {
      const newProfile = await profileService.create(profileData)
      setProfiles(prev => [...prev, newProfile])
      setCurrentProfile(newProfile)
      return newProfile
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  const switchProfile = (profile) => {
    setCurrentProfile(profile)
  }

  const value = {
    currentProfile,
    profiles,
    loading,
    createProfile,
    switchProfile,
    loadProfiles
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}