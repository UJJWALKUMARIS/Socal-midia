import React, { useRef, useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dp from '../assets/dp.jpg';
import axios from 'axios';
import { url } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';

function EditProfile() {
  const nav = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const imageInput = useRef(null);
  const dispatch = useDispatch();

  const [frontendImage, setFrontendImage] = useState(userData?.profilePic || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [name, setName] = useState(userData?.name || '');
  const [bio, setBio] = useState(userData?.bio || '');
  const [profacation, setProfacation] = useState(userData?.profacation || '');
  const [loading, setLoading] = useState(false);

  // handle image click
  const handleImageClick = () => {
    imageInput.current.click();
  };

  // handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  // save edited profile
  const handleEditProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("profacation", profacation); // ✅ matches your model
      if (backendImage) {
        formData.append("profileImage", backendImage); // ✅ fixed variable name
      }

      const result = await axios.post(`${url}/api/user/editprofile`, formData, {
        withCredentials: true,
      });

      dispatch(setProfileData(result.data));
      dispatch(setUserData(result.data));
      nav(`/profile/${userData.userName}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#050505] to-[#0f0f0f] flex flex-col items-center text-white pb-10">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center gap-4 px-6 mt-4">
        <MdOutlineArrowBack
          onClick={() => nav(`/profile/${userData.userName}`)}
          className="text-3xl cursor-pointer hover:text-purple-400 transition-all duration-300 hover:scale-110"
        />
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center mt-6">
        <div
          onClick={handleImageClick}
          className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-4 border-purple-500 shadow-[0_0_25px_rgba(147,51,234,0.5)] cursor-pointer hover:opacity-80 transition-all duration-300"
        >
          <img src={frontendImage} alt="Profile" className="w-full h-full object-cover" />
        </div>

        {/* hidden input */}
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          hidden
          onChange={handleFileChange}
        />

        <div className="text-blue-400 hover:text-purple-400 transition-all duration-300 text-center text-[18px] font-semibold mt-3 cursor-pointer">
          Click the image to change profile picture
        </div>
      </div>

      {/* Input Fields */}
      <div className="w-[90%] max-w-[600px] mt-10 flex flex-col gap-5">
        <input
          type="text"
          value={name}
          placeholder="Enter Your Name"
          className="w-full h-[55px] bg-[#0a0a0a] border border-gray-700 rounded-2xl px-5 outline-none font-semibold text-white focus:border-purple-500 transition-all duration-300"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          value={bio}
          placeholder="Enter Your Profession"
          className="w-full h-[55px] bg-[#0a0a0a] border border-gray-700 rounded-2xl px-5 outline-none font-semibold text-white focus:border-purple-500 transition-all duration-300"
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          type="text"
          value={profacation}
          placeholder="Enter Your Bio"
          className="w-full h-[55px] bg-[#0a0a0a] border border-gray-700 rounded-2xl px-5 outline-none font-semibold text-white focus:border-purple-500 transition-all duration-300"
          onChange={(e) => setProfacation(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleEditProfile}
        disabled={loading}
        className={`mt-10 px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 ${
          loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'
        }`}
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
}

export default EditProfile;