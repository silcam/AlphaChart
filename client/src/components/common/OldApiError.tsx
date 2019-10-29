import React from "react";
import { useTranslation } from "./I18nContext";
import LnkBtn from "./LnkBtn";

export default function OldApiError() {
  const t = useTranslation();
  return (
    <div className="compOldApiError">
      {t("Old_api_error")}
      <LnkBtn text={t("Reload")} onClick={() => window.location.reload()} />
    </div>
  );
}
