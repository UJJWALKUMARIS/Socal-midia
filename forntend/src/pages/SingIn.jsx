import React, { useState } from 'react';
import logo from '../../public/fabicon.png';
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import logo2 from "../assets/logo2.png";
import axios from "axios"
import { url } from '../App';
import { ClipLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Singin() {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loding, setLoding] = useState(false);
  const [error, setError] = useState("");
  const dispach = useDispatch()
  const navigate = useNavigate();

  // For now just log the data (later you can send it to backend)
  const handlesingin = async (e) => {
    setLoding(true);
    setError("")
    e.preventDefault();
    try {
      const result = await axios.post(`${url}/api/auth/signin`, {
        userName,
        password
      }, {
        withCredentials: true
      })
      dispach(setUserData(result.data))
      setLoding(false);
      navigate("/")
    } catch (error) {
      setError(error.response?.data?.message);
      console.log("frontend singin error", error);
      setLoding(false);
    }
  };

  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
        {/* Left Form */}
        <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] justify-center gap-[20px]'>
          <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
            <span>Sign In to</span>
            <img src={logo} alt="logo" className='w-[70px]' />
          </div>

          {/* Form Inputs */}
          <form onSubmit={handlesingin} className="w-full flex flex-col items-center">

            {/* Username */}
            <div className='relative flex items-center w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black'>
              <input
                type="text"
                id="userName"
                className='w-full h-full rounded-2xl px-[20px] outline-none border-0'
                placeholder='Enter Your Username'
                autoComplete='off'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>



            {/* Password */}
            <div className='relative flex items-center w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black'>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className='w-full h-full rounded-2xl px-[20px] outline-none border-0'
                placeholder='Enter Your Password'
                autoComplete='off'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className='absolute right-[12px] flex items-center justify-center px-2 py-1'
              >
                {showPassword ? (
                  <IoIosEyeOff className='cursor-pointer w-[25px] h-[25px]' />
                ) : (
                  <IoIosEye className='cursor-pointer w-[25px] h-[25px]' />
                )}
              </button>

            </div>
            <br />
            <p className='mt-2 w-[90%] px-[10px]'>
              Forgot password?{" "}
              <Link to="/resetpassword" className='text-blue-600 hover:underline font-semibold'>
                Reset Now
              </Link>
            </p>

            {error && <p className='text-red-500'>{error}</p>}

            
            {/* Signup Button */}
            <button
              type="submit"
              className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px] hover:bg-gray-800 transition'
            >
              {loding ? <ClipLoader size={20} color='blue' /> : "Sing In"}
            </button>
          </form>

          {/* Already have'n account */}
          <p className='mt-2'>
            You have'n an account?{" "}
            <Link to="/singup" className='text-blue-600 hover:underline font-semibold'>
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right Side Info Box */}
        <div className='md:w-[50%] h-full hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-10 rounded-l-[30px] shadow-2xl shadow-black'>
          <img
            src={logo2}
            alt="logo"
            className='w-[120px] mb-6 hover:scale-110 transition-transform duration-300'
          />
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg max-w-[90%] space-y-4">
            <p className="leading-relaxed">
              🚨 If you use another person’s email,
              your account will be <span className="text-red-400 font-bold">permanently deleted.</span>
            </p>
            <p className="leading-relaxed">
              📩 If you notice that your Gmail has been used by <span className="text-yellow-300 font-semibold">anyone else</span>,
              please contact us immediately at:
              <span className="block text-blue-400 font-bold mt-1">uk6207179775@gmial.com</span>
            </p>
          </div>
          <div className="w-[60%] h-[1px] bg-gray-600 my-6"></div>
          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center">
            ✨ It's not just a platform, it's a real vybe ✨
          </p>
        </div>
      </div>
    </div>
  );
}

export default Singin;
