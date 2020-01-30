import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bannerSlice from "../banners/bannerSlice";
import currentUserSlice from "./currentUserSlice";
import loadingSlice from "../api/loadingSlice";
import alphabetSlice from "../components/alphabets/alphabetSlice";
import groupSlice from "../components/groups/groupSlice";
import userSlice from "./userSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import pageSlice from "./pageSlice";
import networkSlice from "./networkSlice";

const reducer = combineReducers({
  currentUser: currentUserSlice.reducer,
  banners: bannerSlice.reducer,
  loading: loadingSlice.reducer,
  alphabets: alphabetSlice.reducer,
  groups: groupSlice.reducer,
  users: userSlice.reducer,
  page: pageSlice.reducer,
  network: networkSlice.reducer
});

const store = configureStore({ reducer });

export type AppState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export default store;
