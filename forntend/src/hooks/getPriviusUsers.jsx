import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../App";
import { setAllStoryData, setStoryData } from "../redux/storySlice";
import { setPriviousChatUser } from "../redux/massageSlice";

function getPriviusUsers() {
    const { messages } = useSelector((state) => state.message);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(
                    `${url}/api/massage/getprevchat`,
                    { withCredentials: true }
                );

                dispatch(setPriviousChatUser(result.data));
            } catch (error) {
                console.error("Failed to fetch story:", error.response?.data || error.message);
            }
        };

        fetchUser();
    }, [messages]);
}

export default getPriviusUsers;