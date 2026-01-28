import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../App";;
import { setLoopData } from "../redux/loopSlice";

function getAllLoop() {
  const {userData} = useSelector(state=>state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLoop = async () => {
      try {
        const result = await axios.get(`${url}/api/loop/getall`, {
          withCredentials: true,
        });
        dispatch(setLoopData(result.data)); // ✅ save user data in Redux
      } catch (error) {
        console.error("Failed to fetch user:", error.response?.data || error.message);
      }
    };

    fetchLoop();
  }, [dispatch,userData]);
}

export default getAllLoop;