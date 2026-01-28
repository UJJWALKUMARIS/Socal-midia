import React, { useState } from 'react'
import logo from '../../public/fabicon.png';
import { IoIosEyeOff, IoIosEye } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import logo2 from "../assets/logo2.png";
import axios from "axios";
import { url } from '../App';
import { ClipLoader } from "react-spinners";

function SingUp() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // STEP 1 → Send OTP
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${url}/api/auth/signup-otp`, {
        name,
        userName,
        email,
        password
      }, { withCredentials: true });
      setLoading(false);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      console.log("frontend signup error", error);
      setLoading(false);
    }
  };

  // STEP 2 → Verify OTP and Auto Signup
  const handleStep2 = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${url}/api/auth/verify-signup-otp`, {
        name,
        userName,
        email,
        password,
        otp
      }, { withCredentials: true });
      console.log("Account created successfully ✅", res.data);

      setLoading(false);
      navigate("/singin"); // redirect after success
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
      console.log("OTP verify error", error);
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
      {/* STEP 1: User Info + Send OTP */}
      {step === 1 && (
        <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
          <div className='w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px]'>
            <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
              <span>Sign Up to</span>
              <img src={logo} alt="logo" className='w-[70px]' />
            </div>

            <form onSubmit={handleSignup} className="w-full flex flex-col items-center">
              <input
                type="text"
                placeholder='Enter Your Name'
                className='w-[90%] h-[50px] rounded-2xl mt-[30px] px-[20px] border-2 border-black outline-none'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder='Enter Your Username'
                className='w-[90%] h-[50px] rounded-2xl mt-[30px] px-[20px] border-2 border-black outline-none'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder='Enter Your Email'
                className='w-[90%] h-[50px] rounded-2xl mt-[30px] px-[20px] border-2 border-black outline-none'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className='relative flex items-center w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter Your Password'
                  className='w-full h-full rounded-2xl px-[20px] outline-none border-0'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className='absolute right-[12px]'
                >
                  {showPassword ? <IoIosEyeOff size={25} /> : <IoIosEye size={25} />}
                </button>
              </div>

              {error && <p className='text-red-500 mt-2'>{error}</p>}

              <button
                type="submit"
                className='w-[70%] h-[50px] bg-black text-white font-semibold rounded-2xl mt-[30px] hover:bg-gray-800 transition'
              >
                {loading ? <ClipLoader size={20} color='blue' /> : "Send OTP"}
              </button>
            </form>

            <p className='mt-2'>
              Already have an account?{" "}
              <Link to="/singin" className='text-blue-600 hover:underline font-semibold'>
                Sign In
              </Link>
            </p>
          </div>

          {/* Right Side Info */}
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
      )}

      {/* STEP 2: OTP Verification */}
      {step === 2 && (
        <div className='w-[90%] max-w-[500px] h-[400px] bg-white rounded-2xl flex flex-col justify-center items-center'>
          <h2 className='text-[30px] font-semibold'>Enter OTP</h2>
          <input
            type="text"
            placeholder='Enter OTP'
            className='w-[80%] h-[50px] rounded-2xl mt-[30px] px-[20px] border-2 border-black outline-none'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <p className='text-red-500 mt-2'>{error}</p>}
          <button
            className='w-[70%] h-[50px] bg-black text-white font-semibold rounded-2xl mt-[30px] hover:bg-gray-800 transition'
            onClick={handleStep2}
          >
            {loading ? <ClipLoader size={20} color='blue' /> : "Verify & Create Account"}
          </button>
        </div>
      )}
    </div>
  );
}

export default SingUp;