import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-3 rounded-2xl border-2 border-purple-200 
          focus:border-primary focus:outline-none 
          text-lg font-medium
          transition-colors duration-200
          ${error ? 'border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-error text-sm font-medium">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input