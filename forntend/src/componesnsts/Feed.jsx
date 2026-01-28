import React from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import logo from "../assets/logo2.png";
import StoryDp from './StoryDp';
import { useSelector } from 'react-redux';
import Nav from './Nav';
import Post from './Post';
import { IoChatbubbleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function Feed() {
  const nav = useNavigate();
  const { userData, notification } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { storyData } = useSelector((state) => state.story);

  const sortedPosts = postData
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const storiesArray = Array.isArray(storyData)
    ? storyData
    : storyData
      ? [storyData]
      : [];

  const allStories = [
    {
      userId: userData?._id,
      userName: userData?.userName,
      profilePic: userData?.profilePic,
    },
    ...storiesArray.filter((s) => s.userId !== userData?._id),
  ];
  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-auto border-r-2 border-gray-900">

      {/* Header */}
      <div className="w-full lg:w-0 h-[100px] lg:h-0 flex items-center justify-between px-[20px]">
        <img src={logo} alt="logo" className="w-[100px] gap-[10px]" />
        <div className='flex lg:hidden gap-[10px]'>
          <IoChatbubbleOutline
            onClick={() => nav("/massage")}
            className="text-white w-[30px] h-[30px] cursor-pointer hover:text-gray-300 transition" />
          <div className='relative' onClick={() => nav("/notification")}>
            <IoMdNotificationsOutline  className="text-white w-[30px] h-[30px] cursor-pointer hover:text-gray-300 transition" />
            {notification?.length > 0 &&
              <>

                {notification?.some(n => n.isRead === false) &&
                  <div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-1px]'></div>
                }
              </>
            }          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="flex w-full overflow-x-auto gap-[18px] items-center p-[20px] scrollbar-hide">
        <StoryDp stories={allStories} />
      </div>

      {/* Posts Section */}
      <div className="w-full bg-white min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] rounded-t-[60px] relative pb-[120px]">
        <Nav />{sortedPosts?.length ? (
          sortedPosts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <>
            <p className="text-gray-500 mt-10">
              Please reload the page to get posts
            </p>
            <p className="text-gray-500 mt-10">
              This may be due to a server error — it’ll be fixed soon.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default Feed
