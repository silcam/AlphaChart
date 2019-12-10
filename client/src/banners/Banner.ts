import { TKey } from "../i18n/en";
import { AppError } from "../AppError/AppError";

export type AppBanner =
  | {
      type: "Error";
      error: AppError;
    }
  | { type: "Success"; message: TKey };
