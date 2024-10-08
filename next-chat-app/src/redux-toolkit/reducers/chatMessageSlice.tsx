import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessagesState {
  chatMessages: { messages: []; groupedMessages: [] };
  chatGroupMembers: [];
  chatMessagesGroupByDate: {};
}

const initialState: ChatMessagesState = {
  chatMessages: { messages: [], groupedMessages: [] },
  chatGroupMembers: [],
  chatMessagesGroupByDate: {},
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

    chatMessagesGroupByDatesRecord: (state, action: PayloadAction<any>) => {
      state.chatMessagesGroupByDate = action.payload;
    },
  },
});

export const {
  chatMessagesRecord,
  chatGroupMembersRecord,
  chatMessagesGroupByDatesRecord,
} = ChatMessagesSlice.actions;

export default ChatMessagesSlice.reducer;
