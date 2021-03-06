import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LnkBtn from "./LnkBtn";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../state/appState";
import bannerSlice from "../../banners/bannerSlice";
import { AppBanner } from "../../banners/Banner";
import { useTranslation } from "./useTranslation";
import Loading from "./Loading";
import { AppError } from "../../AppError/AppError";
import { TFunc } from "../../i18n/i18n";

export default function AppBanners() {
  const banners = useSelector((state: AppState) => state.banners);
  const dispatch = useDispatch();

  // Clear banners on location change
  const location = useLocation();
  useEffect(() => {
    dispatch(bannerSlice.actions.reset());
  }, [location.pathname]);

  return (
    <div className="compAppBanners">
      {banners.map((banner, index) => {
        switch (banner.type) {
          case "Error":
            return (
              <AppBannerError
                key={index}
                error={banner.error}
                close={() => dispatch(bannerSlice.actions.remove(banner))}
              />
            );
          case "Success":
            return <AppBannerSuccess banner={banner} key={index} />;
        }
      })}
    </div>
  );
}

function AppBannerSuccess(props: { banner: AppBanner }) {
  const t = useTranslation();
  if (props.banner.type != "Success") return null;

  const message = props.banner.networkConnectionRestored
    ? t("Connection_restored")
    : props.banner.message;
  return (
    <div className="banner successBanner">
      <div>{message}</div>
    </div>
  );
}

function AppBannerError(props: { error: AppError; close: () => void }) {
  const t = useTranslation();

  return (
    <div className="banner errorBanner">
      <div style={{ flexDirection: "row" }}>
        <div className="message">{errorMessage(t, props.error)}</div>
        {props.error.type == "No Connection" && <Loading small />}
        {props.error.type == "Old API" && (
          <LnkBtn text={t("Reload")} onClick={() => window.location.reload()} />
        )}
      </div>
      {allowClose(props.error) && <LnkBtn text="X" onClick={props.close} />}
    </div>
  );
}

function errorMessage(t: TFunc, err: AppError): string {
  switch (err.type) {
    case "Alphachart":
      return t("App_error", { status: err.code });
    case "HTTP":
      return t("Server_error", { status: `${err.status}` });
    case "No Connection":
      return t("No_connection");
    case "Old API":
      return t("Old_api_error");
    case "Other":
      return t(err.message);
    case "Unknown":
    default:
      return t("Unknown_error");
  }
}

function allowClose(err: AppError) {
  return ["Alphachart", "HTTP", "Other", "Unknown"].includes(err.type);
}
