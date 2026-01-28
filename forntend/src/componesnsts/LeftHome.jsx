import React, { useEffect, useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import logo from '../assets/logo2.png';
import dp from '../assets/dp.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { url } from '../App';
import { setSuggestedUser, setUserData } from '../redux/userSlice.js';
import OtherUser from './OtherUser.jsx';

function LeftHome() {
    const [loading, setLoading] = useState(false);
    const [randomUsers, setRandomUsers] = useState([]);
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { userData, notification } = useSelector(state => state.user);

    // ✅ Fetch suggested users and randomize immediately
    useEffect(() => {
        const fetchSuggested = async () => {
            try {
                const res = await axios.get(`${url}/api/user/suggested`, { withCredentials: true });
                const users = res.data.filter(u => u._id !== userData?._id); // exclude current user
                dispatch(setSuggestedUser(users));

                // ✅ Shuffle and pick random 3 users right after fetching
                if (users.length > 0) {
                    const shuffled = [...users].sort(() => 0.5 - Math.random());
                    setRandomUsers(shuffled.slice(0, 3));
                }
            } catch (err) {
                console.error("Failed to fetch suggested users:", err);
            }
        };

        fetchSuggested();
    }, [dispatch, userData]);

    const logout = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${url}/api/auth/signout`, {
                withCredentials: true,
            });

            if (res.status === 200) {
                // clear redux state
                dispatch(setSuggestedUser(null))
                dispatch(setUserData(null));

                // go to singin page
                nav('/singin', { replace: true });
            }
        } catch (error) {
            console.error('Logout Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[25%] hidden lg:flex flex-col min-h-screen bg-black border-r border-gray-900">
            {/* Header */}
            <div className="w-full h-[100px] flex items-center justify-between px-[20px]">
                <img src={logo} alt="logo" className="w-[180px]" />
                <div className='relative'>
                    <IoMdNotificationsOutline onClick={()=>nav("/notification")} className="text-white w-[30px] h-[30px] cursor-pointer hover:text-gray-300 transition" />
                    {notification?.length > 0 &&
                        <>

                            {notification?.some(n => n.isRead === false) &&
                                <div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-1px]'></div>
                            }
                        </>
                    }
                </div>
            </div>

            {/* User Info */}
            <div className="flex items-center justify-between px-[20px] py-[15px] border-t border-b border-gray-800">
                <div className="flex items-center gap-[10px]">
                    <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-gray-700">
                        <img
                            src={userData?.profilePic || dp}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[18px] text-white font-semibold">
                            {userData?.userName || 'username'}
                        </span>
                        <span className="text-[14px] text-gray-400 font-medium">
                            {userData?.name || 'username'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={logout}
                    disabled={loading}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition duration-200 ${loading
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                        }`}
                >
                    {loading ? <ClipLoader size={18} color="#fff" /> : 'Logout'}
                </button>
            </div>
            {/* Suggested Users */}
            <div className="w-full flex flex-col gap-[10px] p-[20px]">
                <h1 className="text-white text-[22px] mb-2 font-semibold">Suggested Users</h1>
                {randomUsers.length > 0 ? (
                    randomUsers.map((user, index) => <OtherUser key={index} user={user} />)
                ) : (
                    <p className="text-gray-400 text-sm">No suggestions available.</p>
                )}
            </div>
        </div>
    );
}

export default LeftHome;