import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserContactsState {
  userContacts: [];
  userContactStoryFeeds: [];
}

const initialState: UserContactsState = {
  userContacts: [],
  userContactStoryFeeds: [],
};

export const userContactsSlice = createSlice({
  name: "userContacts",
  initialState,
  reducers: {
    userContactsRecord: (state, action: PayloadAction<any>) => {
      state.userContacts = action.payload;
    },
    userContactStoryFeedsRecord: (state, action: PayloadAction<any>) => {
      state.userContactStoryFeeds = action.payload;
    },
  },
});

export const { userContactsRecord, userContactStoryFeedsRecord } =
  userContactsSlice.actions;

export default userContactsSlice.reducer;
