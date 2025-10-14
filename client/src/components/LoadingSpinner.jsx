const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pastel-bg">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pastel-blue"></div>
      <p className="mt-4 text-gray-600 font-bold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

