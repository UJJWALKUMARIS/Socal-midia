import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { url } from '../App';
import { toggleFollow } from '../redux/userSlice';

function FollowButon({ targatUserId, tailwind }) {

    const { userData } = useSelector(state => state.user);
    const { sockets } = useSelector(state => state.socket);
    const [isFollowing, setIsFollowing] = useState(userData?.following?.includes(targatUserId));
    const [loding, setLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        // Update local state when userData changes
        setIsFollowing(userData?.following?.includes(targatUserId));
    }, [userData?.following, targatUserId]);

    useEffect(() => {
        if (!sockets) return;

        // Listen for real-time follower updates
        const handleFollowerUpdate = (data) => {
            // Update the follow status in real-time
            if (data.userId && (data.type === 'follow' || data.type === 'unfollow')) {
                // Only update if it affects this specific user
                if (data.userId === targatUserId) {
                    dispatch(toggleFollow(targatUserId));
                }
            }
        };

        sockets.on('followerUpdate', handleFollowerUpdate);

        return () => {
            sockets.off('followerUpdate', handleFollowerUpdate);
        };
    }, [targatUserId, dispatch, sockets]);

    const heldleFollow = async () => {
        setLoading(true);
        
        // Optimistically update UI immediately
        setIsFollowing(!isFollowing);
        
        try {
            const result = await axios.get(`${url}/api/user/follow/${targatUserId}`, { withCredentials: true });
            dispatch(toggleFollow(targatUserId));
            setLoading(false);
        } catch (error) {
            console.log(error);
            // Revert the optimistic update on error
            setIsFollowing(!isFollowing);
            setLoading(false);
        }
    }

    return (
        <button className={tailwind} onClick={heldleFollow} disabled={loding}>
            {loding == false &&
                <div >
                    {isFollowing ? "Unfollow" : "Follow"}
                </div>
            }
            {loding == true &&
                <div>
                    Loding...
                </div>
            }
            
        </button>
    )
}

export default FollowButon;