import { configureStore } from "@reduxjs/toolkit";
import splashScreenReducer from "./splashScreenSlice";

const store = configureStore({
    reducer: {
        splashScreen: splashScreenReducer,
    }
});

export default store;