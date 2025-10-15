import { useEffect, useRef } from 'react';

const BackgroundBlobs = () => {
  const containerRef = useRef(null);
  const blobsRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const pastelColors = [
      '#FFADAD', // Pastel red
      '#FFD6A5', // Pastel orange
      '#FDFFB6', // Pastel yellow
      '#CAFFBF', // Pastel green
      '#9BF6FF', // Pastel cyan
      '#A0C4FF', // Pastel blue
      '#BDB2FF', // Pastel purple
      '#FFC6FF', // Pastel pink
    ];

    const numBlobs = 6;
    const container = containerRef.current;
    if (!container) return;

    // Create blob elements
    for (let i = 0; i < numBlobs; i++) {
      const blobEl = document.createElement('div');
      blobEl.className = 'blob-element';
      
      const size = Math.random() * 250 + 150; // 150px to 400px
      const initialX = Math.random() * (window.innerWidth - size);
      const initialY = Math.random() * (window.innerHeight - size);
      
      blobEl.style.width = `${size}px`;
      blobEl.style.height = `${size}px`;
      blobEl.style.backgroundColor = pastelColors[i % pastelColors.length];
      blobEl.style.position = 'absolute';
      blobEl.style.borderRadius = '50%';
      blobEl.style.opacity = '0.8';
      blobEl.style.willChange = 'transform';
      
      container.appendChild(blobEl);
      
      blobsRef.current.push({
        el: blobEl,
        x: initialX,
        y: initialY,
        vx: (Math.random() - 0.5) * 2.5, // Velocity x
        vy: (Math.random() - 0.5) * 2.5, // Velocity y
        size: size
      });
    }

    // Animation loop
    const animateBlobs = () => {
      blobsRef.current.forEach(blob => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Bounce off edges
        if (blob.x <= 0 || blob.x + blob.size >= window.innerWidth) {
          blob.vx *= -1;
          blob.x = Math.max(0, Math.min(blob.x, window.innerWidth - blob.size));
        }
        if (blob.y <= 0 || blob.y + blob.size >= window.innerHeight) {
          blob.vy *= -1;
          blob.y = Math.max(0, Math.min(blob.y, window.innerHeight - blob.size));
        }

        blob.el.style.transform = `translate(${blob.x}px, ${blob.y}px)`;
      });

      animationFrameRef.current = requestAnimationFrame(animateBlobs);
    };

    animateBlobs();

    // Handle window resize
    const handleResize = () => {
      blobsRef.current.forEach(blob => {
        blob.x = Math.min(blob.x, window.innerWidth - blob.size);
        blob.y = Math.min(blob.y, window.innerHeight - blob.size);
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      blobsRef.current.forEach(blob => {
        if (blob.el && blob.el.parentNode) {
          blob.el.parentNode.removeChild(blob.el);
        }
      });
      blobsRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
      style={{ filter: 'blur(80px)' }}
    />
  );
};

export default BackgroundBlobs;

