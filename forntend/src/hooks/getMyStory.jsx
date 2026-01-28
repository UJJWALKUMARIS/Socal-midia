import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../App";
import { setStoryData } from "../redux/storySlice";

function useMyStory() {
  const { userData } = useSelector((state) => state.user);
  const {storyData} = useSelector((state) => state.story);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStory = async () => {
      if (!userData?.userName) return;

      try {
        const result = await axios.get(
          `${url}/api/story/getstroybyusername/${userData.userName}`,
          { withCredentials: true }
        );

        // ✅ Save story data in Redux
        dispatch(setStoryData(result.data));
      } catch (error) {
        console.error("Failed to fetch story:", error.response?.data || error.message);
      }
    };

    fetchStory();
  }, [dispatch, userData]);
}

export default useMyStory;