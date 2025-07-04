import { motion } from 'framer-motion'

const Avatar = ({ 
  avatarId, 
  size = 'medium', 
  isSelected = false, 
  onClick,
  className = '' 
}) => {
  const avatars = {
    '1': '🦁', '2': '🐸', '3': '🦊', '4': '🐼', '5': '🦄', '6': '🐙'
  }
  
  const sizes = {
    small: 'w-12 h-12 text-xl',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-20 h-20 text-3xl'
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        ${sizes[size]} 
        rounded-full 
        flex items-center justify-center 
        cursor-pointer
        transition-all duration-200
        ${isSelected 
          ? 'bg-gradient-to-br from-primary to-purple-600 shadow-lg' 
          : 'bg-gradient-to-br from-white to-purple-50 shadow-button hover:shadow-lg'
        }
        ${className}
      `}
    >
      <span className="select-none">
        {avatars[avatarId] || avatars['1']}
      </span>
    </motion.div>
  )
}

export default Avatar