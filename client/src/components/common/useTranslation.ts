import { tForLocale } from "../../i18n/i18n";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";

export function useTranslation() {
  const locale = useSelector((state: AppState) => state.currentUser.locale);
  return tForLocale(locale);
}
