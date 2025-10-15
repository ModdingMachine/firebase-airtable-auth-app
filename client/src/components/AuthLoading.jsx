const AuthLoading = ({ message = 'Setting up your account...' }) => {
  return (
    <div className="fixed inset-0 bg-pastel-bg/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md mx-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pastel-blue mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">{message}</p>
          <p className="text-gray-600 text-sm mt-2">This will only take a moment...</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLoading;

