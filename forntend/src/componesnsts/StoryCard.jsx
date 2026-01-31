import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.jpg";
import axios from "axios";
import { url } from "../App.jsx";
import { setViews } from "../redux/storySlice.js";
import { useNavigate } from "react-router-dom";

function StoryCard({ story, onNext, onPrev, isCurrentUser }) {
    if (!story) return null;

    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [hasError, setHasError] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [viewTracked, setViewTracked] = useState(false);
    const [showViewers, setShowViewers] = useState(false);
    const [viewerDetails, setViewerDetails] = useState([]);
    const [loadingViewers, setLoadingViewers] = useState(false);
    const storyData = useSelector((state) => state.story.storyData);

    const mediaUrl = story?.midia || story?.media;
    const profileImage = story?.author?.profilePic || dp;
    const userName =
        story?.author?.userName || story?.author?.username || "Unknown User";
    const caption = story?.caption || "";
    const viewers = story?.views || [];
    const viewCount = viewers.length;

    const isVideo =
        story?.midiaType === "video" ||
        mediaUrl?.includes(".mp4") ||
        mediaUrl?.includes(".webm") ||
        mediaUrl?.includes(".video");

    // FETCH VIEWER DETAILS
    useEffect(() => {
        const fetchViewerDetails = async () => {
            if (isCurrentUser && viewers.length > 0 && showViewers) {
                setLoadingViewers(true);
                try {
                    const viewerPromises = viewers.map(async (viewerId) => {
                        try {
                            const response = await axios.get(`${url}/api/user/${viewerId}`, {
                                withCredentials: true,
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            });
                            return response.data;
                        } catch (err) {
                            console.error(`Error fetching viewer ${viewerId}:`, err);
                            return null;
                        }
                    });

                    const details = await Promise.all(viewerPromises);
                    setViewerDetails(details.filter(Boolean));
                } catch (err) {
                    console.error("Error fetching viewer details:", err);
                } finally {
                    setLoadingViewers(false);
                }
            }
        };

        fetchViewerDetails();
    }, [viewers, showViewers, isCurrentUser]);

    // TIME AGO
    const getTimeAgo = (createdAt) => {
        if (!createdAt) return "Just now";

        try {
            const created = new Date(createdAt);
            const now = new Date();

            const diffMs = now - created;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHr = Math.floor(diffMin / 60);
            const diffDay = Math.floor(diffHr / 24);

            if (diffSec < 60) return "Just now";
            if (diffMin < 60) return `${diffMin}m ago`;
            if (diffHr < 24) return `${diffHr}h ago`;
            return `${diffDay}d ago`;
        } catch (err) {
            return "Recently";
        }
    };

    const timeAgo = getTimeAgo(story?.createdAt);

    // TRACK VIEW
    useEffect(() => {
        const trackView = async () => {
            if (story?._id && !viewTracked && !isCurrentUser) {
                try {
                    const result = await axios.get(`${url}/api/story/view/${story._id}`, {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    if (result.data) {
                        dispatch(setViews(result.data));
                    }
                    setViewTracked(true);
                    console.log("View tracked");
                } catch (err) {
                    console.error("View error:", err);
                }
            }
        };

        const timer = setTimeout(trackView, 500);
        return () => clearTimeout(timer);
    }, [story?._id, viewTracked, isCurrentUser, dispatch]);

    // VIDEO PROGRESS & AUTOPLAY
    useEffect(() => {
        if (isVideo && videoRef.current) {
            const video = videoRef.current;

            const updateProgress = () => {
                if (video.duration) {
                    setProgress((video.currentTime / video.duration) * 100);
                }
            };

            const handleEnd = () => {
                if (onNext) onNext();
            };

            const handleCanPlay = () => {
                setIsVideoLoaded(true);
                if (!isPaused) {
                    video.play().catch((err) => {
                        console.error("Autoplay failed:", err);
                        setHasError(false); // Don't set error, just show play button
                    });
                }
            };

            video.addEventListener("timeupdate", updateProgress);
            video.addEventListener("ended", handleEnd);
            video.addEventListener("canplay", handleCanPlay);

            return () => {
                video.removeEventListener("timeupdate", updateProgress);
                video.removeEventListener("ended", handleEnd);
                video.removeEventListener("canplay", handleCanPlay);
            };
        }
    }, [isVideo, story?._id, isPaused, onNext]);

    // IMAGE PROGRESS
    useEffect(() => {
        if (!isVideo && mediaUrl && !isPaused) {
            const duration = 5000;
            const interval = 50;
            let elapsed = 0;

            const timer = setInterval(() => {
                elapsed += interval;
                setProgress((elapsed / duration) * 100);

                if (elapsed >= duration) {
                    clearInterval(timer);
                    if (onNext) onNext();
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [isVideo, mediaUrl, isPaused, onNext]);

    // RESET ON STORY CHANGE
    useEffect(() => {
        setHasError(false);
        setIsVideoLoaded(false);
        setProgress(0);
        setIsPaused(false);
        setViewTracked(false);
        setShowViewers(false);
        setViewerDetails([]);
    }, [story?._id]);

    const handleVideoError = () => {
        console.error("Video error occurred");
        setHasError(true);
    };

    const handleImageError = (e) => (e.target.src = dp);

    const handleVideoClick = () => {
        if (!isVideo || !videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play().catch((err) => console.error("Play error:", err));
            setIsPaused(false);
        } else {
            videoRef.current.pause();
            setIsPaused(true);
        }
    };

    const handleStoryClick = (e) => {
        if (e.target.closest("button") || e.target.closest(".no-pause")) return;
        if (isVideo) handleVideoClick();
    };

    const toggleViewers = (e) => {
        e.stopPropagation();
        setShowViewers(!showViewers);
    };

    return (
        <div
            className="w-full max-w-[500px] h-[100vh] flex flex-col items-center justify-center relative bg-black overflow-hidden border-x border-gray-800 cursor-pointer"
            onClick={handleStoryClick}
        >
            {/* MEDIA */}
            {isVideo && !hasError ? (
                <>
                    <video
                        ref={videoRef}
                        src={mediaUrl}
                        playsInline
                        preload="auto"
                        onError={handleVideoError}
                        className="w-full h-full object-contain"
                    />

                    {(!isVideoLoaded || isPaused) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                            <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                                <svg
                                    className="w-10 h-10 text-white ml-1"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <img
                    src={hasError ? profileImage : mediaUrl || profileImage}
                    alt="story"
                    className="w-full h-full object-contain"
                    onError={handleImageError}
                />
            )}

            {/* TOP BAR */}
            <div className="absolute top-0 left-0 right-0 w-full z-30 no-pause">
                {/* PROGRESS BAR - Made thicker and more visible */}
                <div className="flex gap-1 px-3 pt-2 pb-3">
                    <div className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* USER INFO */}
                <div className="flex items-center px-3 pb-2 bg-gradient-to-b from-black/70 to-transparent" onClick={()=>navigate(`/profile/${userName}`)}>
                    <img
                        src={profileImage}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                        onError={(e) => (e.target.src = dp)}
                    />
                    <div className="ml-3 text-white flex-1">
                        <p className="font-semibold text-sm">{userName}</p>
                        <p className="text-xs text-gray-300">{timeAgo}</p>
                    </div>

                    {/* CLOSE BUTTON */}
                    <button
                        className="text-white text-3xl hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center transition-colors ml-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.history.back();
                        }}
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* VIEWERS MODAL - Only for current user */}
            {2+1 === 4 && isCurrentUser && showViewers && (
                <div
                    className="absolute inset-0 bg-black/80 z-40 flex items-end no-pause"
                    onClick={toggleViewers}
                >
                    <div
                        className="w-full bg-gray-900 rounded-t-3xl max-h-[70vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-700 z-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white text-lg font-semibold">
                                    Viewers ({viewCount})
                                </h3>
                                <button
                                    onClick={toggleViewers}
                                    className="text-gray-400 hover:text-white text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            {loadingViewers ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="border-4 border-gray-600 border-t-white rounded-full w-8 h-8 animate-spin"></div>
                                </div>
                            ) : viewerDetails.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">
                                    No views yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {viewerDetails.map((viewer, index) => (
                                        <div
                                            key={viewer._id || index}
                                            className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded-lg transition-colors"
                                        >
                                            <img
                                                src={viewer?.profilePic || dp}
                                                alt={viewer?.userName}
                                                className="w-12 h-12 rounded-full object-cover"
                                                onError={(e) => (e.target.src = dp)}
                                            />
                                            <div className="flex-1">
                                                <p className="text-white font-medium">
                                                    {viewer?.name || viewer?.userName}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    @{viewer?.userName}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW COUNT BUTTON - Only for current user */}
            {2+1 === 4 && isCurrentUser && (
                <button
                    onClick={toggleViewers}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-5 py-2.5 rounded-full flex items-center gap-2 z-30 no-pause transition-all shadow-lg"
                >
                    <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    <span className="text-white font-semibold text-base">{viewCount}</span>
                </button>
            )}

            {/* TAP LEFT / RIGHT */}
            <div className="absolute inset-0 flex z-10">
                <div
                    className="w-1/3 h-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onPrev) onPrev();
                    }}
                />
                <div className="w-1/3 h-full" />
                <div
                    className="w-1/3 h-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onNext) onNext();
                    }}
                />
            </div>
        </div>
    );
}

export default StoryCard;
