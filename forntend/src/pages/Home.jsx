import React from 'react'
import LeftHome from '../componesnsts/LeftHome.jsx';
import RighHome from '../componesnsts/RighHome.jsx';
import Feed from '../componesnsts/Feed.jsx';
import useMyStory from '../hooks/getMyStory.jsx';
import getAllStory from '../hooks/getAllStory.jsx';
import getAllPost from '../hooks/getAllPost.jsx';
import getAllLoop from '../hooks/getAllLoop.jsx';

function Home() {
  useMyStory();
  getAllStory();
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <LeftHome/>
      <Feed/>
      <RighHome/>
    </div>
  )
}

export default Home