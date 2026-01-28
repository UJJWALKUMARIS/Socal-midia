import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { url } from "../App";
import { setUserData } from "../redux/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${url}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data)); // ✅ save user data in Redux
      } catch (error) {
        console.error("Failed to fetch user:", error.response?.data || error.message);
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;