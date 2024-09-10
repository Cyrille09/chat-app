import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// style components
import { LOCAL_STORAGE_USER_TOKEN } from "../../constants/defaultValues";

export interface UserState {
  token: string;
}
const initialState = {
  token: Cookies.get(LOCAL_STORAGE_USER_TOKEN) || "",
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
