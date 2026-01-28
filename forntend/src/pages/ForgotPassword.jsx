import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import {url} from '../App.jsx';

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [loding, setLoding] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const heldleStep2 = async () => {
        setLoding(true);
        try {
            const res = await axios.post(`${url}/api/auth/forgot-password-otp`, { email });
            console.log(res.data);
            setStep(2);
            setLoding(false);
        } catch (error) {
            setLoding(false);
            console.error("Send OTP failed:", error);
        }
    }
    const heldleStep3 = async () => {
        setLoding(true);
        try {
            const res = await axios.post(`${url}/api/auth/verify-forgot-password-otp`, { email, otp });
            console.log(res.data);
            setStep(3);
            setLoding(false);
        } catch (error) {
            setLoding(false);
            console.error("Verify OTP failed:", error);
        }
    }
    const heldleStep4 = () =>{
        setLoding(true);
        try {
            const res = axios.post(`${url}/api/auth/reset-password`, { email, newPassword });
            console.log(res.data);
            setLoding(false);
            navigate('/singin');
        } catch (error) {
            setLoding(false);
            console.log("Reset Password failed:",error);
        }
    }
    
    return (
        <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
            {step == 1 &&
                <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>
                    <h1 className='text-2xl font-bold mb-4'>Forgot Password</h1>
                    <p className='mb-6 text-center px-4'>Enter your email address below to receive a OTP reset link.</p>
                        <input
                            type="email"
                            placeholder='Enter Your Email'
                            className='w-[90%] h-[50px] rounded-2xl mt-[30px] px-[20px] border-2 border-black outline-none'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button
                        type='submit'
                        className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px] hover:bg-gray-800 transition'
                        onClick={heldleStep2}
                    >
                        {loding ? <ClipLoader size={20} color='blue' /> : "Send OTP"}
                    </button>
                    <p className='mt-4'>Remember your password? <span onClick={()=>{navigate('/singin')}} className='text-blue-500 cursor-pointer hover:underline'>Sign In</span></p>
                    {error && <p className='text-red-500 mt-2'>{error}</p>}
                </div>
            }

            {step == 2 &&
                <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>
                    <h2 className='text-[30px] font-semibold'>Enter OTP</h2>
                    <div className='relative flex items-center w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black'>
                        <input
                            type="text"
                            id="otp"
                            className='w-full h-full rounded-2xl px-[20px] outline-none border-0'
                            placeholder='Enter OTP'
                            autoComplete='off'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px] hover:bg-gray-800 transition'
                        onClick={heldleStep3}
                    >
                        {loding ? <ClipLoader size={20} color='blue' /> : "Verify OTP"}
                    </button>
                    <p className='mt-4'>Remember your password? <span onClick={()=>{navigate('/singin')}} className='text-blue-500 cursor-pointer hover:underline'>Sign In</span></p>
                    {error && <p className='text-red-500 mt-2'>{error}</p>}
                </div>
            }
            {step == 3 &&
                <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]'>
                    <h2 className='text-[30px] font-semibold'>Reset Password</h2>
                    <div className='relative flex items-center w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black'>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            className='w-full h-full rounded-2xl px-[20px] outline-none border-0'
                            placeholder='Enter Your New Password'
                            autoComplete='off'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            onClick={() => setShowNewPassword(prev => !prev)}
                            className='absolute right-3'
                        >
                            {showNewPassword ? <FaEyeSlash className='cursor-pointer w-[25px] h-[25px]' /> : <FaEye className='cursor-pointer w-[25px] h-[25px]' />}
                        </button>
                   </div>
                    <button
                        className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px] hover:bg-gray-800 transition'
                        onClick={heldleStep4}
                    >
                        {loding ? <ClipLoader size={20} color='blue' /> : "Reset Password"}
                    </button>
                    <p className='mt-4'>Remember your password? <span onClick={()=>{navigate('/singin')}} className='text-blue-500 cursor-pointer hover:underline'>Sign In</span></p>
                    {error && <p className='text-red-500 mt-2'>{error}</p>}
                </div>
            }
        </div>
    )
}

export default ForgotPassword
