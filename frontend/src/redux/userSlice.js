import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail: null,
    userPassword: null,
    userName: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // action parameter only needs when you are passing certain value using dispatch
        setUserCredentials: (state, action) => {
            console.log("Reducer hit with payload:", action.payload);
            state.userEmail = action.payload?.userEmail || null;
            state.userPassword = action.payload?.userPassword || null;
            state.userName = action.payload?.userName || null;
          },

        clearCredentials: (state) => {
            state.userEmail = null;
            state.userPassword = null;
            state.userName = null;
        }
    }
});

export const {setUserCredentials, clearCredentials} = userSlice.actions;
export default userSlice.reducer;