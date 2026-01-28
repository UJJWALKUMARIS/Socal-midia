import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import dp from "../assets/dp.jpg";

function StoryDp() {
  const navigate = useNavigate();
  const { userData, following } = useSelector((state) => state.user);
  const { storyData, allStoryData } = useSelector((state) => state.story);

  const hasStory = storyData && storyData.length > 0;

  const allStories = allStoryData?.story || [];

  // Group stories by user
  const storyByUser = allStories.reduce((acc, story) => {
    const userId = story.author._id;
    if (!acc[userId]) {
      acc[userId] = {
        user: story.author,
        stories: []
      };
    }
    acc[userId].stories.push(story);
    return acc;
  }, {});

  // Separate following stories and other stories
  const followingStories = Object.values(storyByUser).filter((storyGroup) => {
    return following?.includes(storyGroup.user._id) && storyGroup.user._id !== userData?._id;
  });

  const otherStories = Object.values(storyByUser).filter((storyGroup) => {
    return !following?.includes(storyGroup.user._id) && storyGroup.user._id !== userData?._id;
  });

  // Combine: following stories first, then other stories
  const allUserStories = [...followingStories, ...otherStories];

  const handleStoryClick = (userName) => {
    navigate(`/story/${userName}`);
  };

  return (
    <div className="flex gap-4 px-3 py-3 overflow-x-auto scrollbar-hide">
      {/* Your Story */}
      <div className="flex flex-col items-center relative cursor-pointer flex-shrink-0">
        <div
          onClick={() =>
            hasStory
              ? handleStoryClick(userData?.userName)
              : navigate("/uplod?type=story")
          }
          className={`relative w-[75px] h-[75px] rounded-full p-[2px] transition-all ${
            hasStory
              ? "bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-orange-400 hover:scale-105"
              : "bg-gray-500 hover:scale-105"
          }`}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
            <img
              src={userData?.profilePic || dp}
              alt="Your story"
              className="w-full h-full object-cover"
            />
          </div>

          {!hasStory && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/uplod?type=story");
              }}
              className="absolute bottom-0 right-0 w-[26px] h-[26px] flex items-center justify-center rounded-full bg-blue-500 border-2 border-gray-900 hover:bg-blue-600 transition-all"
            >
              <FiPlus className="text-white text-lg" />
            </button>
          )}
        </div>
        <p
          className={`text-xs font-semibold truncate w-[70px] text-center mt-1 ${
            hasStory ? "text-gray-200" : "text-gray-400"
          }`}
        >
          Your Story
        </p>
      </div>

      {/* All Other Stories */}
      {allUserStories.map(({ user, stories }) => (
        <div
          key={user._id}
          onClick={() => handleStoryClick(user.userName)}
          className="flex flex-col items-center relative cursor-pointer flex-shrink-0"
        >
          <div className="relative w-[75px] h-[75px] rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-400 hover:scale-105 transition-all">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
              <img
                src={user?.profilePic || dp}
                alt={user.userName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-xs font-semibold truncate w-[70px] text-center mt-1 text-gray-200">
            {user.userName}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StoryDp;