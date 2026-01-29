import React, { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { GoHeart, GoHeartFill } from "react-icons/go";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { url } from "../App.jsx";
import { setPostData } from '../redux/postSlice.js';
import dp from '../assets/dp.jpg';
import { setUserData } from '../redux/userSlice.js';
import FollowButon from './FollowButon.jsx';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

function Post({ post }) {
    const { userData } = useSelector(state => state.user);
    const { sockets } = useSelector(state => state.socket);
    const { postData } = useSelector(state => state.post);
    const [isSaved, setIsSaved] = useState(post.savedBy?.includes(userData._id) || false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const dispatch = useDispatch();
    const nav = useNavigate();
    const isOtherUser = userData.userName !== post.author?.userName;

    // Ref for comments container
    const commentsEndRef = useRef(null);

    // Auto-scroll to bottom when comments change or modal opens
    useEffect(() => {
        if (showComments && commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [post.comments.length, showComments]);

    // LIKE POST
    const like = async () => {
        try {
            const result = await axios.get(`${url}/api/post/likes/${post._id}`, { withCredentials: true });
            const updatedPost = result.data;
            const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p);
            dispatch(setPostData(updatedPosts));
        } catch (error) {
            console.warn("Like error:", error);
        }
    };

    const deletePost = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            await axios.get(`${url}/api/post/debug/${post._id}`, {
                withCredentials: true,
            });

            const updatedPosts = postData.filter(p => p._id !== post._id);
            dispatch(setPostData(updatedPosts));

            alert("Post deleted successfully ✅");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete post ❌");
        }
    };


    // SAVE POST
    const handleSave = async () => {
        try {
            const result = await axios.get(`${url}/api/post/saved/${post._id}`, { withCredentials: true });

            // Merge previous saved posts with updated ones from backend
            const updatedUserData = {
                ...userData,
                saved: result.data.saved || userData.saved || []
            };

            dispatch(setUserData(updatedUserData));
            setIsSaved(true);
        } catch (error) {
            console.error("Save error:", error);
        }
    };


    // ADD COMMENT
    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            const result = await axios.post(
                `${url}/api/post/comments/${post._id}`,
                { message: commentText },
                { withCredentials: true }
            );

            const updatedPost = result.data;
            const updatedPosts = postData.map(p =>
                p._id === post._id ? updatedPost : p
            );
            dispatch(setPostData(updatedPosts));
            setCommentText("");
        } catch (error) {
            console.error("Comment error:", error);
        }
    };

    useEffect(() => {
        sockets?.on("likePost",(updatedData)=>{
            const updatedPosts = postData.map(p => p._id === updatedData.postId ? {...p,likes:updatedData.likes} : p);
            dispatch(setPostData(updatedPosts));
        });

        sockets?.on("commentPost",(updatedData)=>{
            const updatedPosts = postData.map(p => p._id === updatedData.postId ? {...p,comments:updatedData.comments} : p);
            dispatch(setPostData(updatedPosts));
        });
        
        return () => {
            sockets?.off("likePost");
            sockets?.off("commentPost");
        }
    }, [sockets,postData,dispatch]);

    return (
        <>
            {/* POST CARD */}
            <div className="w-full sm:max-w-xl mx-auto my-4 sm:my-6 px-2 sm:px-0 bg-white rounded-2xl shadow-lg shadow-gray-400/30 overflow-hidden flex flex-col transition-transform hover:scale-[1.01] duration-300">

                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer" >
                    <img
                        onClick={() => nav(`/profile/${post.author.userName}`)}
                        src={post.author?.profilePic || dp}
                        alt={post.author?.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col" onClick={() => nav(`/profile/${post.author?.userName}`)}>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{post.author?.name}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">@{post.author?.userName}</p>
                    </div>
                    <span className="ml-auto text-gray-400 text-xs sm:text-sm mr-2 sm:mr-4">
                        {formatDistanceToNow(new Date(post.createdAt?.toString()), { addSuffix: true })}
                    </span>
                    {!isOtherUser && (
                        <button
                            onClick={deletePost}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            <MdDelete />
                        </button>
                    )}
                    {isOtherUser && (
                        <FollowButon
                            tailwind="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium text-xs sm:text-sm cursor-pointer"
                            targatUserId={post?.author?._id}
                        />
                    )}
                </div>

                {/* Media */}
                <div className="w-full bg-gray-100">
                    {post.midia && post.midiaType === 'image' && (
                        <img
                            src={post.midia}
                            alt="Post media"
                            className="w-full max-h-[300px] sm:max-h-[500px] object-cover"
                        />
                    )}
                    {post.midia && post.midiaType === 'video' && (
                        <video controls className="w-full max-h-[300px] sm:max-h-[500px]">
                            <source src={post.midia} type="video/mp4" />
                        </video>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-between items-center px-3 py-2 sm:px-4 sm:py-3 border-b border-gray-200">
                    <div className="flex gap-4">
                        <button
                            className="text-gray-600 hover:text-red-500 transition flex items-center gap-1 text-sm sm:text-base"
                            onClick={like}
                        >
                            {!post?.likes?.includes(userData._id) && <GoHeart />}
                            {post?.likes?.includes(userData._id) && <GoHeartFill className='text-red-600' />}
                            {post?.likes?.length}
                        </button>
                        <button
                            className="text-gray-600 hover:text-blue-500 transition flex items-center gap-1 text-sm sm:text-base"
                            onClick={() => setShowComments(true)}
                        >
                            💬 {post.comments.length}
                        </button>
                    </div>
                    <button
                        onClick={handleSave}
                        className="text-gray-600 hover:text-yellow-500 transition flex items-center gap-1"
                    >
                        {isSaved ? <BsBookmarkFill size={20} /> : <BsBookmark size={20} />}
                    </button>
                </div>

                {/* Caption */}
                {post.caption && (
                    <div className="px-3 sm:px-4 py-2 sm:py-3 break-words">
                        <p className="text-gray-800 text-sm sm:text-base">
                            <span className="font-semibold mr-2">{post.author.name}</span>
                            {post.caption}
                        </p>
                    </div>
                )}
            </div>

            {/* COMMENTS MODAL */}
            {showComments && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-white w-[90%] max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-[fadeIn_0.3s_ease] max-h-[80vh]">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                            <h2 className="font-semibold text-lg text-gray-800">Comments</h2>
                            <IoMdClose
                                size={26}
                                onClick={() => setShowComments(false)}
                                className="cursor-pointer text-gray-500 hover:text-gray-800 transition"
                            />
                        </div>

                        {/* Comments List */}
                        <div className="flex max-h-[50vh] flex-col gap-3 px-4 py-3 overflow-y-auto">
                            {post.comments.length > 0 ? (
                                post.comments.map((c, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-none"
                                    >
                                        <img
                                            src={c.user?.profilePic || dp}
                                            alt={c.user?.userName}
                                            className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                                        />
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {c.user?.userName}:
                                                </p>
                                                <p className="text-sm text-gray-700">{c.text}</p>
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1">
                                                {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 text-sm py-10">No comments yet. Be the first to comment!</p>
                            )}
                            {/* Invisible div for auto-scroll target */}
                            <div ref={commentsEndRef} />
                        </div>

                        {/* Add Comment */}
                        <div className="flex items-center gap-2 p-3 border-t border-gray-200">
                            <img
                                src={userData?.profilePic || dp}
                                alt="User"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="flex-1 bg-gray-100 rounded-full px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAddComment}
                                className="text-blue-500 font-semibold hover:text-blue-700 transition text-sm sm:text-base"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Post;
