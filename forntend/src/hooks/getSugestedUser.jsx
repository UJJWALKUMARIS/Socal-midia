import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../App";
import { setSuggestedUser } from "../redux/userSlice";

function useGetSuggestedUser() {
  const dispatch = useDispatch();
  const suggestedUsers = useSelector(
    (state) => state.user.suggestedUser
  );

  useEffect(() => {
    // prevent refetch loop
    if (suggestedUsers?.length > 0) return;

    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${url}/api/user/suggested`,
          { withCredentials: true }
        );
        dispatch(setSuggestedUser(result.data));
      } catch (error) {
        console.error(
          "Failed to suggested user:",
          error.response?.data || error.message
        );
      }
    };

    fetchUser();
  }, [dispatch]); // ✅ stable dependency
}

export default useGetSuggestedUser;
