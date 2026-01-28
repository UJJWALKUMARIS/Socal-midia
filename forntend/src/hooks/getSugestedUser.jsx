import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../App";
import { setSuggestedUser, setUserData } from "../redux/userSlice";
import { useEffect } from 'react';

function getSuggestedUser() {
  const dispatch = useDispatch();
  const userData = useSelector(state=>state.user)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${url}/api/user/suggested`, {
          withCredentials: true,
        });
        dispatch(setSuggestedUser(result.data)); // ✅ save user data in Redux
      } catch (error) {
        console.error("Failed to sugested user:", error.response?.data || error.message);
      }
    };

    fetchUser();
  }, [userData]);
}

export default getSuggestedUser;