import { createSlice } from "@reduxjs/toolkit";

// Retrieve initial state from localStorage if it exists, otherwise default to `true`
const initialState = {
  toggleDarkMode: localStorage.getItem("toggleDarkMode") === "true" || true,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkTheme: (state, action) => {
      const newState = action.payload?.toggleDarkMode ?? true;
      state.toggleDarkMode = newState;
      // Save the new state to localStorage
      localStorage.setItem("toggleDarkMode", newState.toString());
    },
  },
});

// Export actions
export const { setDarkTheme } = themeSlice.actions;
export default themeSlice.reducer;
