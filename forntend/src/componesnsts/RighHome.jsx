import React, { useState } from 'react';
import axios from 'axios';
import { url } from '../App.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { useNavigate } from 'react-router-dom';
import Massage from './Massage.jsx';

function RightHome() {
  const userData = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleClick = async () => {
    // 🚨 Confirmation Alert
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account permanently?\nThis action cannot be undone!"
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axios.delete(
        `${url}/api/auth/delete-account/${userData?._id}`,
        { withCredentials: true }
      );

      dispatch(setUserData(null));
      nav("/singin", { replace: true });
    } catch (error) {
      console.error("Delete Account Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[25%] hidden lg:block min-h-screen bg-black border-r-2 border-gray-900 p-6">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition
          ${loading
            ? "bg-red-900 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
          } text-white shadow-lg`}
      >
        {loading ? "Deleting..." : "Delete Account Permanently"}
      </button>
      <Massage/>
    </div>
  );
}

export default RightHome;