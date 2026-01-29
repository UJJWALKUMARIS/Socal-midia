import React, { useState } from 'react';
import logo from '../../public/fabicon.png';
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import logo2 from "../assets/logo2.png";
import axios from "axios";
import { url } from '../App';
import { ClipLoader } from "react-spinners";

function SingUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${url}/api/auth/signup-simple`,
        { name, userName, email, password },
        { withCredentials: true }
      );

      navigate("/singin");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex justify-center items-center'>
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex overflow-hidden border-2 border-[#1a1f23]">

        {/* LEFT */}
        <div className='w-full lg:w-[50%] flex flex-col items-center p-4'>
          <div className='flex gap-2 items-center text-xl font-semibold mt-10'>
            <span>Sign Up to</span>
            <img src={logo} alt="logo" className='w-[70px]' />
          </div>

          <form onSubmit={handleSignup} className="w-full flex flex-col items-center">

            <input
              type="text"
              placeholder='Enter Your Name'
              className='input'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder='Enter Your Username'
              className='input'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder='Enter Your Email'
              className='input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className='relative w-[90%] h-[50px] mt-6 border-2 border-black rounded-2xl'>
              <input
                type={showPassword ? "text" : "password"}
                placeholder='Enter Your Password'
                className='w-full h-full px-5 rounded-2xl outline-none'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-3'
              >
                {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
              </button>
            </div>

            {error && <p className='text-red-500 mt-2'>{error}</p>}

            <button
              type="submit"
              className='w-[70%] h-[50px] bg-black text-white font-semibold rounded-2xl mt-8 hover:bg-gray-800'
            >
              {loading ? <ClipLoader size={20} color="blue" /> : "Create Account"}
            </button>
          </form>

          <p className='mt-3'>
            Already have an account?{" "}
            <Link to="/singin" className='text-blue-600 font-semibold'>
              Sign In
            </Link>
          </p>
        </div>

        {/* RIGHT */}
        <div className='hidden lg:flex w-[50%] bg-black text-white flex-col justify-center items-center p-10'>
          <img src={logo2} className='w-[120px] mb-6' />
          <p className='text-center text-gray-300'>
            Simple • Fast • Secure  
          </p>
        </div>

      </div>
    </div>
  );
}

export default SingUp;
