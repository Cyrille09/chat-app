import { combineReducers } from "@reduxjs/toolkit";
import actionsSlice from "./actionsSlice";
import counterSlice from "./counterSlice";
import usersSlice from "./usersSlice";
import chatMessageSlice from "./chatMessageSlice";
import authSlice from "./authSlice";
import userContactsSlice from "./userContactsSlice";

export const rootReducers = combineReducers({
  actionsSlice,
  authSlice,
  usersSlice,
  chatMessageSlice,
  userContactsSlice,
  counterSlice,
});
