import { formatDistanceToNow } from "date-fns";
import React, { useRef, useEffect, useState } from "react";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaRegComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import FollowButon from "./FollowButon";
import { useDispatch, useSelector } from "react-redux";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { url } from "../App";
import axios from "axios";
import { setLoopData } from "../redux/loopSlice";

function LoopCards({ loop, isActive, isPlaying, onTogglePlay, onLoopUpdate }) {
  const { userData } = useSelector((state) => state.user);
  const { sockets } = useSelector((state) => state.socket);
  const { loopData } = useSelector((state) => state.loop);
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const commentSectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: "50%", y: "50%" });
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Loading states
  const [videoLoading, setVideoLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  // Get the current loop from Redux to reflect real-time updates
  const currentLoop = Array.isArray(loopData)
    ? loopData.find((l) => l._id === loop._id) || loop
    : loop;

  const isOwnLoop = userData?._id === currentLoop?.author?._id;
  const isOtherUser = !isOwnLoop;

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const updateLoopData = (updatedLoop) => {
    if (onLoopUpdate) {
      onLoopUpdate(updatedLoop);
    }
    if (Array.isArray(loopData)) {
      const updatedLoops = loopData.map((l) =>
        l._id === loop._id ? updatedLoop : l
      );
      dispatch(setLoopData(updatedLoops));
    }
  };

  const like = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const result = await axios.get(`${url}/api/loop/likes/${currentLoop._id}`, {
        withCredentials: true,
      });
      updateLoopData(result.data);
    } catch (error) {
      console.log("Like error:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDoubleClick = async (e) => {
    e.stopPropagation();

    // Set heart position at click point
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHeartPos({ x: `${x}%`, y: `${y}%` });

    // Show animation
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);

    // Like only if not already liked
    if (!currentLoop?.likes?.includes(userData._id)) {
      setLikeLoading(true);
      try {
        const result = await axios.get(`${url}/api/loop/likes/${currentLoop._id}`, {
          withCredentials: true,
        });
        updateLoopData(result.data);
      } catch (error) {
        console.log("Double-click like error:", error);
      } finally {
        setLikeLoading(false);
      }
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      const result = await axios.post(
        `${url}/api/loop/comments/${currentLoop._id}`,
        { message: commentText },
        { withCredentials: true }
      );
      updateLoopData(result.data);
      setCommentText("");
    } catch (error) {
      console.log("Comment error:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete loop functionality
  const handleDeleteLoop = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this loop? This action cannot be undone!"
    );

    if (!confirmDelete) return;

    setDeleteLoading(true);
    try {
      await axios.delete(`${url}/api/loop/delete/${currentLoop._id}`, {
        withCredentials: true,
      });

      // Remove from Redux state
      if (Array.isArray(loopData)) {
        const updatedLoops = loopData.filter((l) => l._id !== currentLoop._id);
        dispatch(setLoopData(updatedLoops));
      }

      // Navigate back to previous page or home
      navigate(-1);
    } catch (error) {
      console.error("Delete loop error:", error);
      alert("Failed to delete loop. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Navigate to the loop creator's profile
  const handleLoopClick = (e) => {
    e.stopPropagation();
    if (currentLoop?.author?._id) {
      navigate(`/profile/${currentLoop.author.userName}`);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive && isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive, isPlaying]);

  useEffect(() => {
    if (showComments && commentSectionRef.current) {
      setTimeout(() => {
        commentSectionRef.current.scrollTo({
          top: commentSectionRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [showComments, currentLoop?.comments]);

  // Socket listeners with proper state updates
  useEffect(() => {
    if (!sockets) return;

    const handleLikeLoop = (updatedData) => {
      console.log("Socket: likeLoop received", updatedData);
      if (Array.isArray(loopData)) {
        const updatedLoops = loopData.map((l) =>
          l._id === updatedData.loopId ? { ...l, likes: updatedData.likes } : l
        );
        dispatch(setLoopData(updatedLoops));
      }
    };

    const handleCommentLoop = (updatedData) => {
      console.log("Socket: commentLoop received", updatedData);
      if (Array.isArray(loopData)) {
        const updatedLoops = loopData.map((l) =>
          l._id === updatedData.loopId ? { ...l, comments: updatedData.comments } : l
        );
        dispatch(setLoopData(updatedLoops));
      }
    };

    sockets.on("likeLoop", handleLikeLoop);
    sockets.on("commentLoop", handleCommentLoop);

    return () => {
      sockets.off("likeLoop", handleLikeLoop);
      sockets.off("commentLoop", handleCommentLoop);
    };
  }, [sockets, dispatch, loopData]);

  return (
    <>
      <div
        className="relative flex items-center justify-center bg-black 
                   w-full lg:max-w-[1000px] h-[100vh] overflow-hidden 
                   border-x border-gray-800 rounded-lg shadow-2xl select-none"
        onClick={onTogglePlay}
        onDoubleClick={handleDoubleClick}
      >
        {/* Video Loading Spinner */}
        {videoLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          src={currentLoop?.midia}
          className="w-full h-full object-cover"
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => setVideoLoading(false)}
          onWaiting={() => setVideoLoading(true)}
          onCanPlay={() => setVideoLoading(false)}
        />

        {/* ❤️ Like animation */}
        {showHeart && (
          <div
            className="absolute text-red-600 text-8xl opacity-90 animate-pop"
            style={{
              top: heartPos.y,
              left: heartPos.x,
              transform: "translate(-50%, -50%)",
            }}
          >
            <GoHeartFill />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

        {/* ▶️ Play icon */}
        {!isPlaying && isActive && !videoLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/40 backdrop-blur-md rounded-full p-6">
              <FaPlay className="text-white text-4xl" />
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-orange-400"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Follow button OR Delete button */}
        {isOtherUser ? (
          <FollowButon
            targatUserId={currentLoop?.author?._id}
            tailwind="absolute bottom-[130px] left-4 bg-gradient-to-r from-pink-500 to-orange-400 
                      text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg 
                      hover:opacity-90 active:scale-95 transition-all duration-200"
          />
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteLoop();
            }}
            disabled={deleteLoading}
            className="absolute bottom-[130px] left-4 bg-red-600 hover:bg-red-700
                      text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg 
                      active:scale-95 transition-all duration-200 flex items-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <MdDelete size={18} />
                Delete
              </>
            )}
          </button>
        )}

        {/* Author info */}
        <div
          className="absolute bottom-[80px] left-4 flex items-center gap-3 cursor-pointer"
          onClick={handleLoopClick}
        >
          <img
            src={currentLoop?.author?.profilePic || dp}
            alt={currentLoop?.author?.name || "User"}
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
          <div className="flex flex-col text-white drop-shadow-lg">
            <p className="font-semibold text-base">{currentLoop?.author?.name}</p>
            <p className="text-sm text-gray-300">@{currentLoop?.author?.userName}</p>
          </div>
        </div>

        {/* Caption */}
        {currentLoop?.caption && (
          <p
            className="absolute bottom-[45px] left-4 right-4 text-white text-sm sm:text-base font-normal 
                      drop-shadow-md leading-snug line-clamp-2"
          >
            {currentLoop?.caption}
          </p>
        )}

        {/* Time */}
        <span className="absolute bottom-4 right-4 text-gray-300 text-xs">
          {formatDistanceToNow(new Date(currentLoop?.createdAt), { addSuffix: true })}
        </span>

        {/* Like + Comment Buttons */}
        <div className="absolute right-6 bottom-28 flex flex-col items-center gap-6 text-white">
          <button
            className="flex flex-col items-center hover:scale-110 transition-transform disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              like();
            }}
            disabled={likeLoading}
          >
            {likeLoading ? (
              <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : currentLoop?.likes?.includes(userData._id) ? (
              <GoHeartFill size={30} className="text-red-600" />
            ) : (
              <GoHeart size={30} />
            )}
            <span className="text-xs">{currentLoop?.likes?.length || 0}</span>
          </button>

          <button
            className="flex flex-col items-center hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
          >
            <FaRegComment className="text-2xl mb-1" />
            <span className="text-xs">{currentLoop?.comments?.length || 0}</span>
          </button>
        </div>
      </div>

      {/* 💬 Comments modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-lg text-gray-800">Comments</h2>
              <IoMdClose
                size={26}
                onClick={() => setShowComments(false)}
                className="cursor-pointer text-gray-500 hover:text-gray-800 transition"
              />
            </div>

            <div
              ref={commentSectionRef}
              className="flex flex-col gap-3 px-4 py-3 overflow-y-auto"
            >
              {currentLoop?.comments?.length > 0 ? (
                currentLoop.comments.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-none"
                  >
                    <img
                      src={c?.author?.profilePic || dp}
                      alt={c?.author?.userName || "User"}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                    />
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {c?.author?.userName || "Unknown"}:
                        </p>
                        <p className="text-sm text-gray-700">{c?.message}</p>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm py-10">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 border-t border-gray-200">
              <img
                src={userData?.profilePic || dp}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                disabled={commentLoading}
                className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
              />
              <button
                onClick={handleAddComment}
                disabled={commentLoading || !commentText.trim()}
                className="text-pink-600 font-semibold hover:text-pink-800 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[50px]"
              >
                {commentLoading ? (
                  <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoopCards;
