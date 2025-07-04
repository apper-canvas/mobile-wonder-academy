import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfile } from '@/hooks/useProfile'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'

const Header = () => {
  const location = useLocation()
  const { currentProfile } = useProfile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Don't show header on profile selector page
  if (location.pathname === '/profile') {
    return null
  }
  
const navItems = [
    { path: '/', label: 'Home', icon: 'Home' },
    { path: '/math-world', label: 'Math World', icon: 'Calculator' },
    { path: '/reading-land', label: 'Reading Land', icon: 'BookOpen' },
    { path: '/stories', label: 'Stories', icon: 'Book' },
    { path: '/my-progress', label: 'My Progress', icon: 'TrendingUp' },
    { path: '/parent-dashboard', label: 'Parent Dashboard', icon: 'BarChart3' },
  ]
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-40 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <ApperIcon name="Sparkles" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Wonder Academy
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${location.pathname === item.path
                    ? 'bg-primary text-white shadow-button'
                    : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                  }
                `}
              >
                <ApperIcon name={item.icon} size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            {currentProfile && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {currentProfile.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <ApperIcon name="Star" size={12} className="text-accent" />
                    <span>{currentProfile.totalStars || 0}</span>
                    <div className="w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{currentProfile.totalCoins || 0}</span>
                    </div>
                  </div>
                </div>
                <Link to="/profile">
                  <Avatar avatarId={currentProfile.avatarId} size="small" />
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white border-t border-purple-100 overflow-hidden"
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${location.pathname === item.path
                  ? 'bg-primary text-white shadow-button'
                  : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                }
              `}
            >
              <ApperIcon name={item.icon} size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {currentProfile && (
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <Avatar avatarId={currentProfile.avatarId} size="small" />
              <div>
                <p className="font-semibold">{currentProfile.name}</p>
                <p className="text-xs text-gray-600">
                  {currentProfile.totalStars || 0} stars • {currentProfile.totalCoins || 0} coins
                </p>
              </div>
            </Link>
          )}
        </div>
      </motion.div>
    </header>
  )
}

export default Header