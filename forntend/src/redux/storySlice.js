import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
    name: "story",
    initialState: {
        storyData: [],
        allStoryData: [],
        views: [],
        viewTracked:false
    },
    reducers: {
        setStoryData: (state, action) => {
            state.storyData = action.payload;
        },
        setAllStoryData: (state, action) => {
            state.allStoryData = action.payload;
        },
        setViewTracked: (state, action) => {
            state.viewTracked = action.payload;
        },
        setViews: (state, action) => {
            state.views = action.payload;
        }
    }
});

export const { 
    setStoryData, 
    setAllStoryData,
    setViewTracked,
    setViews
} = storySlice.actions;

export default storySlice.reducer;