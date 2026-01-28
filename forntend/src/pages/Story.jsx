import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import StoryCard from "../componesnsts/StoryCard";
import { url } from "../App";

function Story() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storyData = useSelector((state) => state.story.storyData);
  const currentUser = useSelector((state) => state.user.user);

  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stories by username
  const handleStory = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await axios.get(
        `${url}/api/story/getstroybyusername/${userName}`,
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      const storyList = Array.isArray(result.data)
        ? result.data
        : [result.data];
      setStories(storyList);
      dispatch(setStoryData(storyList));
    } catch (error) {
      console.error("❌ Get Story by User Name Error:", error);
      setError("Failed to load story");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName) handleStory();
  }, [userName]);

  useEffect(() => {
    return () => {
      dispatch(setStoryData(null));
    };
  }, [dispatch]);

  // Handlers for navigation
  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate("/");
      window.reload();
    }
  }, [currentIndex, stories.length, navigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      navigate("/");
      window.reload();
    }
  }, [currentIndex, navigate]);

  if (loading) {
    return (
      <div className="w-full h-[100vh] bg-black flex items-center justify-center">
        <div className="loader border-4 border-gray-700 border-t-white rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[100vh] bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="w-full h-[100vh] bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">No story found</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isCurrentUser = currentUser?.userName === storyData?.userName || currentUser?.username === userName;

  return (
    <div className="w-full h-[100vh] bg-black flex items-center justify-center">
      <StoryCard
        story={stories[currentIndex]}
        onNext={handleNext}
        onPrev={handlePrev}
        isCurrentUser={isCurrentUser}
      />
    </div>
  );
}

export default Story;