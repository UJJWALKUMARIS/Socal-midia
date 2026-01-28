import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../App";
import { setUserData } from "../redux/userSlice";
import { setPostData } from "../redux/postSlice";

function getAllPost() {
  const {userData} = useSelector(state=>state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await axios.get(`${url}/api/post/getall`, {
          withCredentials: true,
        });
        dispatch(setPostData(result.data)); // ✅ save user data in Redux
      } catch (error) {
        console.error("Failed to fetch user:", error.response?.data || error.message);
      }
    };

    fetchPost();
  }, [dispatch,userData]);
}

export default getAllPost;