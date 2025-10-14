const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  name = '',
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-bold mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-gray-300/50 
                   focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   transition-all duration-200"
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;

