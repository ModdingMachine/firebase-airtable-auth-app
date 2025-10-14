const GlassCard = ({ children, className = '', hover = false }) => {
  const hoverClass = hover ? 'glass-card-hover' : '';
  
  return (
    <div className={`glass-card ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;

