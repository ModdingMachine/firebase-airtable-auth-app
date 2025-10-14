const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [],
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-2xl bg-white/70 border border-gray-300/50 
                   focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:border-transparent
                   disabled:bg-gray-100 disabled:cursor-not-allowed
                   transition-all duration-200 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Select;

