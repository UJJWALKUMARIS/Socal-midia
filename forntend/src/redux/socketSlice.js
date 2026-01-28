import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        sockets: null,
        onlineUser:null
    },
    reducers: {
        setSockets(state, action) {
            state.sockets = action.payload;
        },
        setOnlineUser(state, action) {
            state.onlineUser = action.payload;
        }
    },
});

export const { setSockets,setOnlineUser } = socketSlice.actions;
export default socketSlice.reducer;