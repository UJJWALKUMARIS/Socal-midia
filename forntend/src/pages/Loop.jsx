import React, { useRef, useEffect, useState } from 'react';
import { MdOutlineArrowBack } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import LoopCards from '../componesnsts/LoopCards';
import { useSelector } from 'react-redux';

const Loop = () => {
    const navigate = useNavigate();
    const { loopData } = useSelector(state => state.loop);
    const containerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [shuffledLoops, setShuffledLoops] = useState([]);

    useEffect(() => {
        if (loopData && loopData.length > 0 && shuffledLoops.length === 0) {
            const shuffled = [...loopData].sort(() => Math.random() - 0.5);
            setShuffledLoops(shuffled);
        }
    }, [loopData, shuffledLoops.length]);

    const updateLoopInShuffle = (updatedLoop) => {
        setShuffledLoops(prev => 
            prev.map(loop => 
                loop._id === updatedLoop._id ? updatedLoop : loop
            )
        );
    };

    const handleScroll = () => {
        const scrollTop = containerRef.current.scrollTop;
        const index = Math.round(scrollTop / window.innerHeight);
        setCurrentIndex(index);
    };

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    return (
        <div className="w-screen h-screen bg-black flex flex-col relative">
            <div className="w-full flex items-center p-4 z-20 fixed top-0">
                <MdOutlineArrowBack
                    onClick={() => navigate(-1)}
                    className="text-white text-3xl cursor-pointer hover:text-gray-300 transition-all duration-300"
                />
            </div>

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            >
                {shuffledLoops.map((loop, index) => (
                    <div
                        key={loop._id}
                        className="snap-start w-full h-screen flex items-center justify-center"
                    >
                        <LoopCards 
                            loop={loop} 
                            isActive={index === currentIndex}
                            isPlaying={isPlaying}
                            onTogglePlay={togglePlayPause}
                            onLoopUpdate={updateLoopInShuffle}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Loop;