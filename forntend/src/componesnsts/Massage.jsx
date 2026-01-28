import React, { useEffect } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser, setPriviousChatUser } from "../redux/massageSlice";
import dp from "../assets/dp.jpg";

function Massage() {
    const nav = useNavigate();
    const dispatch = useDispatch();

    const { priviousChatUser, selectedUser } = useSelector((state) => state.message);
    const { onlineUser, socket } = useSelector((state) => state.socket);

    const handleClick = (user) => {
        dispatch(setSelectedUser(user));
        nav("/conv");
    };

    useEffect(() => {
        if (!socket) return;

        // Listen for conversation deletion
        const handleConversationDeleted = ({ conversationId, otherUserId }) => {
            // Remove the user from previous chat list
            dispatch(setPriviousChatUser(
                priviousChatUser.filter(user => user._id !== otherUserId)
            ));

            // If the deleted conversation was with the currently selected user, clear selection
            if (selectedUser?._id === otherUserId) {
                dispatch(setSelectedUser(null));
                nav("/message");
            }
        };

        socket.on("conversationDeleted", handleConversationDeleted);

        // Cleanup
        return () => {
            socket.off("conversationDeleted", handleConversationDeleted);
        };
    }, [socket, priviousChatUser, selectedUser, dispatch, nav]);

    return (
        <div className="w-full min-h-screen lg:min-h-[80vh] bg-black text-white">
            {/* Header */}
            <div className="h-[80px] flex items-center gap-4 px-5 border-b border-gray-800">
                <MdOutlineKeyboardBackspace
                    className="md:hidden cursor-pointer"
                    size={24}
                    onClick={() => nav("/")}
                />
                <h1 className="text-xl font-bold">Messages</h1>
            </div>

            {/* User List */}
            <div className="flex flex-col">
                {priviousChatUser && priviousChatUser.length > 0 ? (
                    priviousChatUser.map((user) => {
                        const isOnline = onlineUser?.includes(user._id);

                        return (
                            <div
                                key={user._id}
                                onClick={() => handleClick(user)}
                                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#111] border-b border-gray-900"
                            >
                                {/* Profile */}
                                <div className="relative">
                                    <img
                                        src={user.profilePic || dp}
                                        className="w-12 h-12 rounded-full object-cover"
                                        alt=""
                                    />

                                    {/* GREEN ONLINE DOT */}
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col">
                                    <h2 className="font-semibold">
                                        {user.name}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        @{user.userName}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <p className="text-lg">No conversations yet</p>
                        <p className="text-sm mt-2">Start a new chat to see it here</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Massage;
