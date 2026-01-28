import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../App";
import { setAllStoryData, setStoryData } from "../redux/storySlice";

function getAllStory() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStory = async () => {
      if (!userData?.userName) return;

      try {
        const result = await axios.get(
          `${url}/api/story/getall`,
          { withCredentials: true }
        );

        // ✅ Save story data in Redux
        dispatch(setAllStoryData(result.data));
      } catch (error) {
        console.error("Failed to fetch story:", error.response?.data || error.message);
      }
    };

    fetchStory();
  }, [ userData]);
}

export default getAllStory;