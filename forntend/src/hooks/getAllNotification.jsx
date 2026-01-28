import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../App";
import { setNotification } from "../redux/userSlice";

function getAllNotification() {
    const dispatch = useDispatch();

    const fetchNotification = async () => {
        try {
            const result = await axios.get(`${url}/api/user/notifications`, {
                withCredentials: true,
            });
            dispatch(setNotification(result.data)); // ✅ save user data in Redux
        } catch (error) {
            console.error("Failed to fetch user:", error.response?.data || error.message);
        }
    };

    fetchNotification();

}

export default getAllNotification; 