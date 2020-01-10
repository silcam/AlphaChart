import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AlphabetListing,
  Alphabet,
  DraftAlphabet,
  AlphOwnerType,
  alphabetCompare
} from "../../models/Alphabet";
import { AppDispatch } from "../../state/appState";
import { webGet, webPost, postFile } from "../../api/apiRequest";
import { LoadAction, loadAction } from "../../state/LoadAction";
import { modelListMerge } from "../../util/arrayUtils";

interface AlphabetState {
  listings: AlphabetListing[];
  alphabets: { [id: string]: Alphabet | undefined };
}

const alphabetSlice = createSlice({
  name: "alphabets",
  initialState: { listings: [], alphabets: {} } as AlphabetState,
  reducers: {
    setAlphabet: (state, action: PayloadAction<Alphabet>) => {
      state.alphabets[action.payload.id] = action.payload;
    }
  },
  extraReducers: {
    ACLoad: (state, action: LoadAction) => {
      if (action.payload.alphabets) {
        action.payload.alphabets.reduce((alphabetsById, alphabet) => {
          alphabetsById[alphabet.id] = alphabet;
          return alphabetsById;
        }, state.alphabets);
      }
      state.listings = modelListMerge(
        state.listings,
        action.payload.alphabetListings,
        alphabetCompare
      );
    }
  }
});

export default alphabetSlice;

export function loadAlphabetListings() {
  return async (dispatch: AppDispatch) => {
    const payload = await webGet("/alphabets");
    if (payload) dispatch(loadAction(payload));
  };
}

export function loadAlphabet(id: string) {
  return async (dispatch: AppDispatch) => {
    const payload = await webGet("/alphabets/:id", { id });
    if (payload) dispatch(loadAction(payload));
  };
}

export function pushDraftAlphabet(draft: DraftAlphabet) {
  return async (dispatch: AppDispatch) => {
    const alphabet = await webPost("/alphabets", {}, draft);
    if (alphabet) dispatch(alphabetSlice.actions.setAlphabet(alphabet));
    return alphabet;
  };
}

export function pushCopyAlphabet(params: {
  id: string;
  owner: string;
  ownerType: AlphOwnerType;
}) {
  const { id, ...ownerParams } = params;
  return async (_: AppDispatch) => {
    const alphId = await webPost("/alphabets/:id/copy", { id }, ownerParams);
    return alphId && alphId.id;
  };
}

export function pushShareAlphabet(params: { id: string; userId: string }) {
  const { id, userId } = params;
  return async (dispatch: AppDispatch) => {
    const payload = await webPost("/alphabets/:id/share", { id }, { userId });
    if (payload) dispatch(loadAction(payload));
    return !!payload;
  };
}

export function pushUnshareAlphabet(params: { id: string; userId: string }) {
  const { id, userId } = params;
  return async (dispatch: AppDispatch) => {
    const alphabet = await webPost(
      "/alphabets/:id/unshare",
      { id },
      { userId }
    );
    if (alphabet) dispatch(alphabetSlice.actions.setAlphabet(alphabet));
  };
}

export function pushChart(alphabet: Alphabet) {
  const { id, chart } = alphabet;
  return async (dispatch: AppDispatch) => {
    const alphabet = await webPost("/alphabets/:id/charts", { id }, chart);
    if (alphabet) dispatch(alphabetSlice.actions.setAlphabet(alphabet));
  };
}

export function pushChartImage(params: { alphabetId: string; image: File }) {
  const { alphabetId, image } = params;
  return async (_: AppDispatch) => {
    const imagePath = await postFile(
      `/alphabets/${alphabetId}/images`,
      "image",
      image
    );
    return imagePath && imagePath.path;
  };
}
