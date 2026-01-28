import { configureStore } from '@reduxjs/toolkit';

import useSlice from "./userSlice.js";
import postSlice from './postSlice.js';
import loopSlice from './loopSlice.js';
import storySlice from './storySlice.js';
import messageSlice from './massageSlice.js';
import socketSlice from './socketSlice.js';

const store = configureStore({
    reducer: {
        user: useSlice,
        post: postSlice,
        loop: loopSlice,
        story: storySlice,
        message: messageSlice,
        socket: socketSlice,
    }
});

export default store;