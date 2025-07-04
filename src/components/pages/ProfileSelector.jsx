import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const ProfileSelector = () => {
  const navigate = useNavigate()
  const { profiles, currentProfile, loading, createProfile, switchProfile } = useProfile()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    avatarId: '1'
  })
  const [creating, setCreating] = useState(false)
  
  const handleProfileSelect = (profile) => {
    switchProfile(profile)
    navigate('/')
  }
  
  const handleCreateProfile = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Please enter a name')
      return
    }
    
    try {
      setCreating(true)
      await createProfile({
        name: formData.name.trim(),
        age: parseInt(formData.age) || 5,
        avatarId: formData.avatarId
      })
      toast.success('Profile created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to create profile')
    } finally {
      setCreating(false)
    }
  }
  
  const avatarOptions = ['1', '2', '3', '4', '5', '6']
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="Sparkles" size={48} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Wonder Academy
          </h1>
          <p className="text-xl text-gray-600">
            {profiles.length > 0 ? 'Choose your profile to continue' : 'Create your first profile to get started!'}
          </p>
        </div>
        
        {!showCreateForm ? (
          <div className="space-y-6">
            {/* Existing Profiles */}
            {profiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profiles.map((profile) => (
                  <motion.div
                    key={profile.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProfileSelect(profile)}
                    className={`
                      card-kids cursor-pointer transition-all duration-200 
                      ${currentProfile?.Id === profile.Id ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar avatarId={profile.avatarId} size="medium" />
                      <div className="flex-1">
                        <h3 className="text-xl font-display text-gray-800">{profile.name}</h3>
                        <p className="text-sm text-gray-600">Age {profile.age}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Star" size={14} className="text-accent" />
                            <span className="text-sm font-semibold">{profile.totalStars || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-accent rounded-full"></div>
                            <span className="text-sm font-semibold">{profile.totalCoins || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Create New Profile Button */}
            <div className="text-center">
              <Button
                onClick={() => setShowCreateForm(true)}
                variant="primary"
                icon="Plus"
                className="text-lg"
              >
                Create New Profile
              </Button>
            </div>
          </div>
        ) : (
          /* Create Profile Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-kids max-w-md mx-auto"
          >
            <h2 className="text-2xl font-display text-gray-800 text-center mb-6">Create Your Profile</h2>
            
            <form onSubmit={handleCreateProfile} className="space-y-6">
              {/* Name Input */}
              <Input
                label="What's your name?"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
                maxLength={20}
                required
              />
              
              {/* Age Input */}
              <Input
                label="How old are you?"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="Enter your age"
                min="4"
                max="10"
              />
              
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Choose your avatar
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {avatarOptions.map((avatarId) => (
                    <Avatar
                      key={avatarId}
                      avatarId={avatarId}
                      size="medium"
                      isSelected={formData.avatarId === avatarId}
                      onClick={() => setFormData({...formData, avatarId})}
                    />
                  ))}
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="flex-1"
                >
                  {creating ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProfileSelector