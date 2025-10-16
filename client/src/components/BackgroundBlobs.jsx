import { useEffect, useRef } from 'react';

const BackgroundBlobs = () => {
  const containerRef = useRef(null);
  const blobsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

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
    console.log('Creating background blobs...');
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
      console.log(`Created blob ${i + 1} with color ${pastelColors[i % pastelColors.length]}`);
      
      blobsRef.current.push({
        el: blobEl,
        x: initialX,
        y: initialY,
        vx: (Math.random() - 0.5) * 2.5, // Velocity x
        vy: (Math.random() - 0.5) * 2.5, // Velocity y
        size: size
      });
    }

    // Mouse interaction
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Animation loop
    const animateBlobs = () => {
      blobsRef.current.forEach(blob => {
        // Calculate distance from mouse
        const blobCenterX = blob.x + blob.size / 2;
        const blobCenterY = blob.y + blob.size / 2;
        const dx = blobCenterX - mouseRef.current.x;
        const dy = blobCenterY - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Mouse repulsion effect
        const repulsionRadius = 200; // Distance at which mouse starts affecting blobs
        if (distance < repulsionRadius) {
          const repulsionStrength = (repulsionRadius - distance) / repulsionRadius;
          const repulsionForce = repulsionStrength * 0.3; // Adjust strength here
          
          // Normalize direction and apply repulsion
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          
          blob.vx += normalizedDx * repulsionForce;
          blob.vy += normalizedDy * repulsionForce;
        }
        
        // Apply velocity with some damping
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.vx *= 0.98; // Damping to prevent infinite acceleration
        blob.vy *= 0.98;

        // Bounce off edges
        if (blob.x <= 0 || blob.x + blob.size >= window.innerWidth) {
          blob.vx *= -0.8; // Add some energy loss on bounce
          blob.x = Math.max(0, Math.min(blob.x, window.innerWidth - blob.size));
        }
        if (blob.y <= 0 || blob.y + blob.size >= window.innerHeight) {
          blob.vy *= -0.8; // Add some energy loss on bounce
          blob.y = Math.max(0, Math.min(blob.y, window.innerHeight - blob.size));
        }

        blob.el.style.transform = `translate(${blob.x}px, ${blob.y}px)`;
      });

      animationFrameRef.current = requestAnimationFrame(animateBlobs);
    };

    animateBlobs();

    // Add mouse event listener
    window.addEventListener('mousemove', handleMouseMove);

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
      window.removeEventListener('mousemove', handleMouseMove);
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
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ 
        filter: 'blur(80px)',
        zIndex: -1
      }}
    />
  );
};

export default BackgroundBlobs;

