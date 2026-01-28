import React, { useEffect, useRef, useState } from 'react';

function ReciverMassage({ message }) {
  const scroll = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (!message) return null;

  const dateObj = new Date(message.createdAt);

  const time = dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const date = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message.massage, message.image]);

  return (
    <div ref={scroll} className="w-full flex justify-start mb-3">
      <div
        className="max-w-[75%] bg-[#1f1f1f] text-white
                   px-4 py-2 rounded-2xl rounded-tl-none"
      >

        {/* IMAGE MESSAGE */}
        {message.image && (
          <div className="relative">
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="w-full h-[250px] bg-white/10 rounded-xl mb-2 flex items-center justify-center animate-pulse">
                <div className="text-gray-400 text-sm">
                  <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              </div>
            )}
            
            {/* Actual Image */}
            <img
              src={message.image}
              alt="message"
              className={`w-full max-h-[250px] object-cover rounded-xl mb-2 ${
                imageLoaded ? 'block' : 'hidden'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </div>
        )}

        {/* TEXT MESSAGE */}
        {message.massage && (
          <p className="text-sm break-words">{message.massage}</p>
        )}

        {/* DATE + TIME */}
        {message.createdAt && (
          <span className="block text-[10px] text-gray-400 mt-1 text-right">
            {date} • {time}
          </span>
        )}

      </div>
    </div>
  );
}

export default ReciverMassage;