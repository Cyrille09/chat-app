import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserContactsState {
  userContacts: [];
}

const initialState: UserContactsState = {
  userContacts: [],
};

export const userContactsSlice = createSlice({
  name: "userContacts",
  initialState,
  reducers: {
    userContactsRecord: (state, action: PayloadAction<any>) => {
      state.userContacts = action.payload;
    },
  },
});

export const { userContactsRecord } = userContactsSlice.actions;

export default userContactsSlice.reducer;
