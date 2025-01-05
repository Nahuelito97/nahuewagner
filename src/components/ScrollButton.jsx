import React, { useState, useEffect } from 'react';
import '../styles/ScrollToTop.css';

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isFlying, setIsFlying] = useState(false); // Nuevo estado para animación de vuelo

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
      setIsRotated(false);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    setIsRotated(true);
    setIsFlying(true); // Activamos la animación de vuelo
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setTimeout(() => {
      setIsRotated(false);
      setIsFlying(false); // Desactivamos la animación de vuelo después de un tiempo
    }, 2500); // Ajusta el tiempo según la duración de la animación
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <div
          className={`scroll-to-top ${
            isRotated ? 'rotate-up' : 'rotate-down'
          } ${isFlying ? 'fly-up' : ''}`}
          onClick={scrollToTop}
        >
          <img
            src="/assets/nahue.jpg"
            alt="Scroll to Top"
            className="kunai-image"
          />
        </div>
      )}
    </div>
  );
};

export default ScrollButton;
