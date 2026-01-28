import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/massageSlice';
import { url } from '../App';

function SenderMassage({ message }) {
    const scroll = useRef();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [lastTap, setLastTap] = useState(0);
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.message);

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

    // FIXED: Delete handler moved to correct location
    const handleDellit = async (messageId) => {
        // Show confirmation alert before deleting
        const confirmed = window.confirm('Are you sure you want to delete this message? This action cannot be undone.');
        
        if (!confirmed) return;

        try {
            setDeleting(true);
            await axios.delete(
                `${url}/api/massage/delete/${messageId}`,
                { withCredentials: true }
            );

            // Update local messages by filtering out deleted message
            dispatch(setMessages(messages.filter(msg => msg._id !== messageId)));

        } catch (error) {
            console.warn('Failed to delete message:', error);
            alert(`Failed to delete message. Please try again.  ${error}`);
        } finally {
            setDeleting(false);
        }
    };

    // FIXED: Double tap handler for mobile
    const handleDoubleTap = () => {
        const now = Date.now();
        const timeSinceLastTap = now - lastTap;
        
        if (timeSinceLastTap < 300) {
            // Double tap detected
            handleDellit(message._id);
        }
        
        setLastTap(now);
    };

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message.massage, message.image]);

    return (
        <div ref={scroll} className="w-full flex justify-end mb-3 group">
            <div
                className="max-w-[75%] bg-gradient-to-r from-purple-500 to-blue-500
                text-white px-4 py-2 rounded-2xl rounded-tr-none relative cursor-pointer active:opacity-75"
                onDoubleClick={() => handleDellit(message._id)}
                onTouchEnd={handleDoubleTap}
            >

                {/* DELETE BUTTON - NOW FUNCTIONAL */}
                <button
                    onClick={() => handleDellit(message._id)}
                    disabled={deleting}
                    className="absolute -left-6 top-1 text-white/70 hover:text-red-400
                    opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                    title="Delete message"
                >
                    {deleting ? '⏳' : '🗑'}
                </button>

                {/* IMAGE MESSAGE */}
                {message.image && (
                    <div className="relative">
                        {!imageLoaded && (
                            <div className="w-full h-[250px] bg-white/20 rounded-xl mb-2 flex items-center justify-center animate-pulse">
                                <div className="text-white/60 text-sm text-center">
                                    <svg
                                        className="animate-spin h-8 w-8 mx-auto mb-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Loading...
                                </div>
                            </div>
                        )}

                        <img
                            src={message.image}
                            alt="sent"
                            className={`w-full max-h-[250px] object-cover rounded-xl mb-2 ${imageLoaded ? 'block' : 'hidden'
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
                    <span className="block text-[10px] text-white/80 mt-1 text-right">
                        {date} • {time}
                    </span>
                )}
            </div>
        </div>
    );
}

export default SenderMassage;