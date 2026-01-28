import { createSlice } from "@reduxjs/toolkit";
const messageSlice = createSlice({
    name: "message",
    initialState: {
        selectedUser: null,
        messages: [],
        priviousChatUser:null,
    },
    reducers: {
        setSelectedUser(state, action) {
            state.selectedUser = action.payload;
        },
        setMessages(state, action) {
            state.messages = action.payload
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
            state.messages = []; // optional but recommended
        },
        setPriviousChatUser(state, action) {
            state.priviousChatUser = action.payload
        }
    },
});

export const { setSelectedUser, setMessages, clearSelectedUser, setPriviousChatUser } = messageSlice.actions;
export default messageSlice.reducer;