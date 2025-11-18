import React, { useEffect, useRef } from 'react';
import './StreamingModal.css';

function StreamingModal({ magnetURI, closeModal }) {
  const containerRef = useRef(null);
  const containerIdRef = useRef(`webtor-player-${Math.random().toString(36).slice(2)}`);

  // Load Webtor player script if needed and initialize player
  useEffect(() => {
    let cancelled = false;
    const ensureScript = () =>
      new Promise((resolve) => {
        if (window.webtor) return resolve();
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@webtor/player-sdk-js/dist/index.min.js';
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    ensureScript().then(() => {
      if (cancelled) return;
      window.webtor = window.webtor || [];
      window.webtor.push({
        id: containerIdRef.current,
        magnet: magnetURI,
        title: 'Streaming',
        app: { theme: 'dark' },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [magnetURI]);

  const closeModalHandler = () => {
    closeModal();
  };

  return (
    <div className="streaming-modal">
      <div className="streaming-modal-content">
        <span className="close" onClick={closeModalHandler}>&times;</span>
        <div
          ref={containerRef}
          id={containerIdRef.current}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

export default StreamingModal;
