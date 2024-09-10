import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// style components

export interface UserState {
  token: string;
}
const initialState = {
  token: "",
};

const authSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
  },
});

export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;
