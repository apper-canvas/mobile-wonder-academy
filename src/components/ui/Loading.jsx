import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'games') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="card-kids animate-pulse">
            <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-4"></div>
            <div className="h-6 bg-purple-200 rounded-full mb-2"></div>
            <div className="h-4 bg-purple-100 rounded-full w-2/3 mb-3"></div>
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-yellow-200 rounded-full"></div>
                ))}
              </div>
              <div className="w-16 h-8 bg-purple-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'stories') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="card-kids animate-pulse">
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4"></div>
            <div className="h-6 bg-purple-200 rounded-full mb-2"></div>
            <div className="h-4 bg-purple-100 rounded-full w-3/4 mb-3"></div>
            <div className="w-20 h-8 bg-primary/20 rounded-full"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4"
      />
      <h3 className="text-xl font-display text-primary mb-2">Getting Ready...</h3>
      <p className="text-gray-600">Just a moment while we prepare your learning adventure!</p>
    </div>
  )
}

export default Loading