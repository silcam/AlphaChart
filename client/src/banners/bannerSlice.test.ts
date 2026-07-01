import bannerSlice from "./bannerSlice";
import { describe, it, expect } from "vitest";
import { AppBanner } from "./Banner";

const reducer = bannerSlice.reducer;

const successBanner: AppBanner = { type: "Success", message: "Done." };
const persistBanner: AppBanner = {
  type: "Success",
  message: "Password changed.",
  persist: true
};
const errorBanner: AppBanner = {
  type: "Error",
  error: { type: "Unknown" }
};

describe("bannerSlice", () => {
  it("starts with empty state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual([]);
  });

  describe("add", () => {
    it("adds a banner", () => {
      const state = reducer(undefined, bannerSlice.actions.add(successBanner));
      expect(state).toEqual([successBanner]);
    });

    it("replaces existing banner", () => {
      const state1 = reducer(
        undefined,
        bannerSlice.actions.add(successBanner)
      );
      const state2 = reducer(
        state1,
        bannerSlice.actions.add({ type: "Success", message: "Second." })
      );
      expect(state2).toEqual([{ type: "Success", message: "Second." }]);
    });
  });

  describe("reset", () => {
    it("clears non-persist banners", () => {
      const state = reducer([successBanner], bannerSlice.actions.reset());
      expect(state).toEqual([]);
    });

    it("clears error banners", () => {
      const state = reducer([errorBanner], bannerSlice.actions.reset());
      expect(state).toEqual([]);
    });

    it("keeps persist:true banners and removes the persist flag", () => {
      const state = reducer([persistBanner], bannerSlice.actions.reset());
      expect(state).toEqual([{ type: "Success", message: "Password changed." }]);
    });

    it("clears formerly-persist banners on subsequent reset", () => {
      const afterFirstNav = reducer(
        [persistBanner],
        bannerSlice.actions.reset()
      );
      const afterSecondNav = reducer(afterFirstNav, bannerSlice.actions.reset());
      expect(afterSecondNav).toEqual([]);
    });

    it("clears only non-persist banners when mixed", () => {
      const state = reducer(
        [successBanner, persistBanner, errorBanner],
        bannerSlice.actions.reset()
      );
      expect(state).toEqual([{ type: "Success", message: "Password changed." }]);
    });
  });
});
