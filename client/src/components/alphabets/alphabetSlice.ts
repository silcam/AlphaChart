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

interface AlphabetState {
  listings: AlphabetListing[];
  alphabets: { [id: string]: Alphabet | undefined };
}

const alphabetSlice = createSlice({
  name: "alphabets",
  initialState: { listings: [], alphabets: {} } as AlphabetState,
  reducers: {
    setListings: (state, action: PayloadAction<AlphabetListing[]>) => {
      state.listings = action.payload.sort(alphabetCompare);
    },
    setAlphabet: (state, action: PayloadAction<Alphabet>) => {
      state.alphabets[action.payload.id] = action.payload;
    }
  }
});

export default alphabetSlice;

export function loadAlphabetListings() {
  return async (dispatch: AppDispatch) => {
    const listings = await webGet("/alphabets");
    if (listings) dispatch(alphabetSlice.actions.setListings(listings));
  };
}

export function loadAlphabet(id: string) {
  return async (dispatch: AppDispatch) => {
    const alphabet = await webGet("/alphabets/:id", { id });
    if (alphabet) dispatch(alphabetSlice.actions.setAlphabet(alphabet));
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
