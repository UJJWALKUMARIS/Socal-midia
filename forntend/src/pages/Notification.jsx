import React, { useEffect, useMemo } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { url } from "../App.jsx";
import { setNotification } from "../redux/userSlice.js";

function Notification() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { notification } = useSelector((state) => state.user);

  // memoized ids
  const notificationIds = useMemo(
    () => notification?.map((n) => n._id),
    [notification]
  );

  const getAllNotification = async () => {
    try {
      const res = await axios.get(`${url}/api/user/notifications`, {
        withCredentials: true,
      });
      dispatch(setNotification(res.data));
    } catch (error) {
      console.warn("getAllNotification error", error);
    }
  };

  const markAsRead = async () => {
    if (!notificationIds?.length) return;

    try {
      await axios.post(
        `${url}/api/user/isReaded`,
        { notificationId: notificationIds },
        { withCredentials: true }
      );
    } catch (error) {
      console.warn("mark error", error);
    }
  };

  // 1️⃣ fetch notifications on mount
  useEffect(() => {
    getAllNotification();
  }, []);

  // 2️⃣ mark read AFTER notifications arrive
  useEffect(() => {
    markAsRead();
  }, [notificationIds]);

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-black border-b border-gray-800">
        <button
          onClick={() => nav(-1)}
          className="p-2 rounded-full hover:bg-gray-800 transition"
        >
          <MdOutlineKeyboardBackspace size={24} />
        </button>
        <h1 className="text-lg font-semibold">Notifications</h1>
      </div>

      {/* Notifications */}
      <div className="divide-y divide-gray-800">
        {notification?.length > 0 ? (
          notification.map((n) => (
            <div
              key={n._id}
              className={`flex items-center gap-3 p-4 hover:bg-[#111] transition cursor-pointer ${
                !n.isRead ? "bg-[#0b0b0b]" : ""
              }`}
            >
              <img
                src={n.sender.profilePic}
                alt={n.sender.userName}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">
                    {n.sender.userName}
                  </span>{" "}
                  {n.message}
                </p>

                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center mt-24 text-gray-400">
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm">You’re all caught up ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;