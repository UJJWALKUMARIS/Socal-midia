import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUser: null,
    profileData: null,
    following: [], // keep in sync with userData.following
    searchData: {
      users: [],
    },
    notification: [],
  },
  reducers: {
    // set the full user data (on login or refresh)
    setUserData: (state, action) => {
      state.userData = action.payload;
      //state.following = action.payload.following || [];
    },

    setSuggestedUser: (state, action) => {
      state.suggestedUser = action.payload;
    },

    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },

    setFollowing: (state, action) => {
      state.following = action.payload;
    },

    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },

    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    // toggle follow/unfollow
    toggleFollow: (state, action) => {
      const targetUserId = action.payload;
      if (state.following?.includes(targetUserId)) {
        state.following = state.following.filter(id => id !== targetUserId);
      } else {
        state.following.push(targetUserId);
      }
    },
  },
});

// ✅ Export actions
export const { setUserData, setSuggestedUser, setProfileData, setFollowing, toggleFollow, setSearchData, setNotification } = userSlice.actions;

export default userSlice.reducer;
