import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-full shadow-button transition-all duration-300 ease-out flex items-center justify-center gap-2 touch-target"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-purple-600 text-white hover:shadow-lg",
    secondary: "bg-gradient-to-r from-secondary to-pink-500 text-white hover:shadow-lg",
    accent: "bg-gradient-to-r from-accent to-yellow-400 text-purple-800 hover:shadow-lg",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white",
    ghost: "text-primary bg-transparent hover:bg-primary/10"
  }
  
  const sizes = {
    small: "py-2 px-4 text-sm",
    medium: "py-3 px-6 text-base",
    large: "py-4 px-8 text-lg"
  }
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <ApperIcon name={icon} size={20} />}
      {children}
      {icon && iconPosition === 'right' && <ApperIcon name={icon} size={20} />}
    </motion.button>
  )
}

export default Button