import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import './StreamingModal.css';

function StreamingModal({ magnetURI, closeModal }) {
  const videoRef = useRef(null);

  const loadHlsStream = (hlsStreamUrl) => {
    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsStreamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsStreamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }
    }
  };

  useEffect(() => {
    // Replace the URL below with your server-side implementation URL.
    const serverUrl = '/convert-magnet';
  
    const convertMagnetToHlsStream = async (magnet) => {
      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ magnet }),
        });
  
        if (response.ok) {
          const data = await response.json();
          const hlsStreamUrl = data.hlsStreamUrl;
          loadHlsStream(hlsStreamUrl);
        } else {
          console.error('Error converting magnet to HLS stream URL');
        }
      } catch (error) {
        console.error('Error fetching HLS stream URL:', error);
      }
    };
  
    convertMagnetToHlsStream(magnetURI);
  }, [magnetURI]);
  

  const closeModalHandler = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    closeModal();
  };

  return (
    <div className="streaming-modal">
      <div className="streaming-modal-content">
        <span className="close" onClick={closeModalHandler}>&times;</span>
        <video ref={videoRef} controls width="100%" height="auto"></video>
      </div>
    </div>
  );
}

export default StreamingModal;
