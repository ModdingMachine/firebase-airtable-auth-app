const SyncIndicator = ({ syncing }) => {
  if (!syncing) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-lg border-2 border-pastel-blue rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-pastel-blue border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-gray-800">Syncing...</span>
      </div>
    </div>
  );
};

export default SyncIndicator;

