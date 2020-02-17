import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "./appState";
import { webGet } from "../api/apiRequest";

type Loader = (dispatch: AppDispatch) => void;

interface NetworkState {
  connected: boolean;
  queuedLoaders: Loader[];
}

const networkSlice = createSlice({
  name: "network",
  initialState: {
    connected: true,
    queuedLoaders: []
  } as NetworkState,
  reducers: {},
  extraReducers: {
    NetworkConnectionLost: (state, action: NetworkConnectionLostAction) => {
      state.connected = false;
      if (action.payload) state.queuedLoaders.push(action.payload);
    },
    NetworkConnectionRestored: state => {
      state.connected = true;
      state.queuedLoaders = [];
    }
  }
});
export default networkSlice;

type NetworkConnectionLostAction = {
  type: "NetworkConnectionLost";
  payload: Loader | undefined;
};
export function networkConnectionLostAction(loader?: Loader) {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const wasConnected = getState().network.connected;

    const action: NetworkConnectionLostAction = {
      type: "NetworkConnectionLost",
      payload: loader
    };
    dispatch(action);

    if (wasConnected) {
      tryToReconnect(() => {
        dispatch(networkConnectionRestoredAction());
      });
    }
  };
}

async function tryToReconnect(onReconnect: () => void) {
  const timer = setInterval(async () => {
    try {
      await webGet("/users/current", {});
      clearInterval(timer);
      onReconnect();
    } catch (err) {
      // Do nothing
    }
  }, 3000);
}

function networkConnectionRestoredAction() {
  return async (dispatch: AppDispatch, getState: () => AppState) => {
    const queuedLoaders = getState().network.queuedLoaders;
    dispatch({ type: "NetworkConnectionRestored" });
    queuedLoaders.forEach(loader => dispatch(loader));
  };
}
