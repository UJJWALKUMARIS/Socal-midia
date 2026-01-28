import React from 'react';
import { AiFillHome } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { TbVideoPlus } from "react-icons/tb";
import { BiSolidVideos } from "react-icons/bi";
import dp from '../assets/dp.jpg';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Nav() {
  const { userData } = useSelector(state => state.user);
  const nav = useNavigate();

  const icons = [
    { icon: <AiFillHome />, label: 'Home', onClick: () => nav("/") },
    { icon: <IoSearch />, label: 'Search', onClick: () => nav("/search")  },
    { icon: <TbVideoPlus />, label: 'Upload', onClick: () => nav("/uplod") },
    { icon: <BiSolidVideos />, label: 'Loop', onClick: ()=>nav("/loop") },
  ];

  return (
    <div className="w-[90%] lg:w-[40%] h-[80px] bg-gradient-to-r from-black to-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-black z-[100] border border-gray-700">
      {icons.map((item, i) => (
        <div
          key={i}
          onClick={item.onClick}
          className="text-white text-3xl hover:scale-110 transition-transform duration-200 hover:text-blue-400 cursor-pointer"
          title={item.label}
        >
          {item.icon}
        </div>
      ))}

      <div
        onClick={() => nav(`/profile/${userData?.userName}`)}
        className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-gray-600 hover:scale-110 transition-transform duration-200 cursor-pointer"
      >
        <img
          src={userData?.profilePic || dp}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default Nav;