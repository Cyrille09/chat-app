import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserContactsState {
  userContacts: [];
  userContactStoryFeeds: [];
  blockUserContact: {
    user: string;
    userBlock: string;
    _id: string;
    status: boolean;
  };
}

const initialState: UserContactsState = {
  userContacts: [],
  userContactStoryFeeds: [],
  blockUserContact: { user: "", userBlock: "", _id: "", status: false },
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
    blockUserContactRecord: (state, action: PayloadAction<any>) => {
      state.blockUserContact = action.payload;
    },
  },
});

export const {
  userContactsRecord,
  userContactStoryFeedsRecord,
  blockUserContactRecord,
} = userContactsSlice.actions;

export default userContactsSlice.reducer;
