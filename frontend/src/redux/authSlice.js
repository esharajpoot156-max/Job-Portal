import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: savedUser ? JSON.parse(savedUser) : null,
        loading: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        }
    }
});

export const { setUser, setLoading, logoutUser } = authSlice.actions;
export default authSlice.reducer;
