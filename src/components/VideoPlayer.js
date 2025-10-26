
import React from 'react';

const VideoPlayer = ({ videoUrl, title }) => {
  if (!videoUrl) return null;

  // Check if the URL is a YouTube embed link
  const isYouTube = typeof videoUrl === 'string' && videoUrl.includes('youtube.com/embed');

  return (
    <div className="relative pt-[56.25%] w-full h-full">
      {isYouTube ? (
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={videoUrl}
          title={title}
          controls
          loop
        >
          Tu navegador no soporta el elemento de video.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
