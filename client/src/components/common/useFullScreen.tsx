import { useAppSelector } from "../../state/appState";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import pageSlice from "../../state/pageSlice";

export default function useFullScreen() {
  const dispatch = useDispatch();
  const fullScreen = useAppSelector(state => state.page.fullScreen);

  // Clear fullscreen on location change
  const location = useLocation();
  useEffect(() => {
    dispatch(pageSlice.actions.setFullScreen(false));
  }, [location.pathname]);

  return fullScreen;
}
