// src/components/MouseMoveEffect.jsx
import React, { useEffect } from 'react';

const MouseMoveEffect = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (window.innerWidth - e.pageX * 2) / 100;
      const y = (window.innerHeight - e.pageY * 2) / 100;
      document.querySelector('.background-3d').style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // No UI rendered from this component
};

export default MouseMoveEffect;
