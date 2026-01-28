import { useSelector } from 'react-redux';
import dp from '../assets/dp.jpg';
import { useNavigate } from 'react-router-dom';
import FollowButon from './FollowButon';

function OtherUser({ user }) {
    const { userData } = useSelector(state => state.user);
    const { onlineUser } = useSelector(state => state.socket);
    const nav = useNavigate();

    // Check if this user is online
    const isOnline = onlineUser?.includes(user._id);

    return (
        <div className='w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800 hover:bg-gray-900 transition-colors cursor-pointer px-4'>
            <div className="flex items-center gap-[10px]">
                <div 
                    className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-gray-700" 
                    onClick={() => nav(`/profile/${user.userName}`)}
                >
                    <img
                        src={user.profilePic || dp}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                    {/* Online Status Indicator */}
                    {isOnline && (
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 
                                      rounded-full border-[3px] border-black shadow-lg"></div>
                    )}
                </div>
                <div className="flex flex-col" onClick={() => nav(`/profile/${user.userName}`)}>
                    <span className="text-[18px] text-white font-semibold">
                        {user.userName || "username"}
                    </span>
                    <span className="text-[14px] text-gray-400 font-medium">
                        {user.name || "username"}
                    </span>
                </div>
            </div>
            <FollowButon 
                tailwind={"bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium cursor-pointer"} 
                targatUserId={user._id}
            />
        </div>
    );
}

export default OtherUser;