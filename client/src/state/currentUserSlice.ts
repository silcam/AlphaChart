import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./appState";
import { Locale } from "../i18n/i18n";
import {
  CurrentUser,
  isCurrentUser,
  LoginAttempt,
  NewUser
} from "../models/User";
import { webGet, webPost } from "../api/apiRequest";
import userSlice from "./userSlice";
import { loadAction, LoadAction } from "./LoadAction";

interface CurrentUserState {
  user: CurrentUser | null;
  locale: Locale;
  loaded: boolean;
}

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: { user: null, locale: "en", loaded: false } as CurrentUserState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
    logout: state => {
      state.user = null;
    }
  },
  extraReducers: {
    ACLoad: (state, action: LoadAction) => {
      const user = action.payload.currentUser;
      if (user) {
        if (isCurrentUser(user)) state.user = user;
        if (user.locale) state.locale = user.locale;
        state.loaded = true;
      }
    }
  }
});

export default currentUserSlice;

export function loadCurrentUser() {
  return async (dispatch: AppDispatch) => {
    const payload = await webGet("/users/current", {});
    if (payload) dispatch(loadAction(payload));
  };
}

export function pushLogin(login: LoginAttempt) {
  return async (dispatch: AppDispatch) => {
    const payload = await webPost("/users/login", {}, login);
    if (payload) dispatch(loadAction(payload));
  };
}

export function pushLogout() {
  return async (dispatch: AppDispatch) => {
    await webPost("/users/logout", {}, null);
    dispatch(currentUserSlice.actions.logout());
  };
}

export function pushVerifyUser(verification: string) {
  return async (dispatch: AppDispatch) => {
    const user = await webPost("/users/verify", {}, { verification });
    if (user) dispatch(userSlice.actions.addUser(user));
    return user;
  };
}

export function pushLocale(locale: Locale) {
  return async (dispatch: AppDispatch) => {
    dispatch(currentUserSlice.actions.setLocale(locale));
    webPost("/users/locale", {}, { locale });
  };
}

export function pushNewUser(user: NewUser) {
  return async (_: AppDispatch) => {
    await webPost("/users", {}, user);
    return true;
  };
}

export function pushResendConfirmation(email: string) {
  return async () => {
    const data = await webPost("/users/resendConfirmation", {}, { email });
    return data;
  };
}

export function pushUpdateUser(data: {
  id: string;
  user?: string;
  email?: string;
}) {
  const { id, ...postData } = data;
  return async (dispatch: AppDispatch) => {
    const payload = await webPost("/users/:id/update", { id }, postData);
    if (payload) dispatch(loadAction(payload));
    return payload;
  };
}
