import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    splash: true,
}

const splashScreenSlice = createSlice({
    name: "splash",
    initialState,
    reducers: {
        // action parameter only needs when you are passing certain value using dispatch
        splashOn: (state) => {
            state.splash = true;
        },
        splashOff: (state) => {
            state.splash = false;
        }
    }
});

export const {splashOn , splashOff} = splashScreenSlice.actions;
export default splashScreenSlice.reducer;