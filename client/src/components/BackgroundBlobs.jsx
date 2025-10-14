import { useState, useEffect } from 'react';

const BackgroundBlobs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Blob 1 - Pastel Blue */}
      <div
        className="absolute w-96 h-96 rounded-full bg-pastel-blue opacity-30 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          top: '10%',
          left: '10%',
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
        }}
      />
      
      {/* Blob 2 - Pastel Pink */}
      <div
        className="absolute w-96 h-96 rounded-full bg-pastel-pink opacity-30 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          top: '60%',
          right: '10%',
          transform: `translate(${-mousePosition.x * 0.8}px, ${-mousePosition.y * 0.8}px)`,
        }}
      />
      
      {/* Blob 3 - Light Pastel Blue */}
      <div
        className="absolute w-80 h-80 rounded-full bg-pastel-light-blue opacity-40 blur-3xl transition-transform duration-1000 ease-out"
        style={{
          bottom: '10%',
          left: '40%',
          transform: `translate(${-mousePosition.x * 0.6}px, ${-mousePosition.y * 0.6}px)`,
        }}
      />
    </div>
  );
};

export default BackgroundBlobs;

