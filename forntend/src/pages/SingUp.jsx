import React, { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../App";
import { ClipLoader } from "react-spinners";
import logo2 from "../assets/logo2.png";

function SingUp() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="w-full h-screen flex justify-center items-center bg-[#0b0b0b]">
      <div className="flex w-[90%] lg:w-[70%] h-[600px] rounded-2xl overflow-hidden shadow-lg">
        
        {/* LEFT FORM */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-10">
          <h2 className="text-2xl font-semibold mb-8">Sign Up to VYBE</h2>

          <form className="w-full flex flex-col items-center" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Enter Your Name"
              className="w-[90%] h-12 rounded-xl border-2 border-black px-4 mb-4 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter Your Username"
              className="w-[90%] h-12 rounded-xl border-2 border-black px-4 mb-4 outline-none"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-[90%] h-12 rounded-xl border-2 border-black px-4 mb-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative w-[90%] h-12 mb-4 border-2 border-black rounded-xl">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                className="w-full h-full px-4 rounded-xl outline-none border-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5"
              >
                {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
              </button>
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <button
              type="submit"
              className="w-[70%] h-12 bg-black text-white font-semibold rounded-xl mt-2 hover:bg-gray-800 flex justify-center items-center"
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/singin" className="text-blue-600 font-semibold">
              Sign In
            </Link>
          </p>
        </div>

        {/* RIGHT INFO PANEL */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex-col justify-center items-center p-10 text-white">
          <img src={logo2} alt="VYBE Logo" className="w-32 mb-6" />
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg max-w-[90%] space-y-4">
            <p>
              🚨 If you use another person’s email, your account will be{" "}
              <span className="text-red-500 font-bold">permanently deleted.</span>
            </p>
            <p>
              📩 If you notice misuse of your Gmail, contact us at:{" "}
              <span className="block text-blue-400 font-bold mt-1">uk6207179775@gmail.com</span>
            </p>
          </div>
          <p className="mt-6 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            ✨ It's not just a platform, it's a real vybe ✨
          </p>
        </div>

      </div>
    </div>
  );
}

export default SingUp;
