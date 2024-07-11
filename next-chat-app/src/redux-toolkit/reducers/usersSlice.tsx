import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  UserInterface,
  UserInterfaceInfo,
} from "@/components/globalTypes/GlobalTypes";

export interface UsersState {
  selectedUser: UserInterface;
  currentUser: UserInterface;
}

const initialState: UsersState = {
  selectedUser: {
    ...UserInterfaceInfo,
  },

  currentUser: {
    ...UserInterfaceInfo,
  },
};

export const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    selectedUserRecord: (state, action: PayloadAction<any>) => {
      state.selectedUser = action.payload;
    },

    currentUserRecord: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { selectedUserRecord, currentUserRecord } = UsersSlice.actions;

export default UsersSlice.reducer;
