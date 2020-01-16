import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: { fullScreen: false },
  reducers: {
    setFullScreen: (state, action: PayloadAction<boolean>) => {
      state.fullScreen = action.payload;
    }
  }
});

export default pageSlice;
