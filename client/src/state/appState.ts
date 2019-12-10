import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bannerSlice from "../banners/bannerSlice";
import currentUserSlice from "./currentUserSlice";
import loadingSlice from "../api/loadingSlice";
import alphabetSlice from "../components/alphabets/alphabetSlice";

const reducer = combineReducers({
  currentUser: currentUserSlice.reducer,
  banners: bannerSlice.reducer,
  loading: loadingSlice.reducer,
  alphabets: alphabetSlice.reducer
});

const store = configureStore({ reducer });

export type AppState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
