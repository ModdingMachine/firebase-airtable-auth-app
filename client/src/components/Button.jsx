const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const baseClasses = 'rounded-full px-6 py-3 font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-white/50 hover:bg-white text-gray-800 shadow-md hover:shadow-lg',
    secondary: 'bg-transparent hover:bg-white/30 text-gray-700 border border-white/40',
    danger: 'bg-red-400/50 hover:bg-red-400 text-white shadow-md hover:shadow-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

