import { configureStore } from "@reduxjs/toolkit";
import splashScreenReducer from "./splashScreenSlice";
import userReducer from "./userSlice"
import themeReducer from "./themeSlice"

const store = configureStore({
    reducer: {
        splashScreen: splashScreenReducer,
        user: userReducer,
        theme: themeReducer,
    }
});

export default store;