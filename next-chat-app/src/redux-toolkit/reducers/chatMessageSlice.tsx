import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessagesState {
  chatMessages: any;
  chatGroupMembers: any;
}

const initialState: ChatMessagesState = {
  chatMessages: [],
  chatGroupMembers: [],
};

export const ChatMessagesSlice = createSlice({
  name: "chatMessages",
  initialState,
  reducers: {
    chatMessagesRecord: (state, action: PayloadAction<any>) => {
      state.chatMessages = action.payload;
    },
    chatGroupMembersRecord: (state, action: PayloadAction<any>) => {
      state.chatGroupMembers = action.payload;
    },
  },
});

export const { chatMessagesRecord, chatGroupMembersRecord } =
  ChatMessagesSlice.actions;

export default ChatMessagesSlice.reducer;
