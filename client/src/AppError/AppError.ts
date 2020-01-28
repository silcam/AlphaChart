import { objKeys } from "../util/objectUtils";
import { TKey } from "../i18n/en";
import { APIError } from "../api/Api";

export type AppError =
  | { type: "No Connection" }
  | { type: "HTTP"; status: number; error?: string; errorCode?: APIError }
  | { type: "Other"; message: TKey }
  | { type: "Unknown" }
  | { type: "Alphachart"; code: "0" | "1" | "2" }
  | { type: "Old API" };
export type AppErrorType = AppError["type"];

const appErrorModels: AppError[] = [
  { type: "No Connection" },
  { type: "HTTP", status: 0 },
  { type: "Other", message: "Image_too_big" },
  { type: "Unknown" },
  { type: "Alphachart", code: "0" },
  { type: "Old API" }
];

export function isAppError(err: any): err is AppError {
  const appErrorModel = appErrorModels.find(model => model.type === err.type);
  if (!appErrorModel) return false;
  return objKeys(appErrorModel).every(
    key => typeof appErrorModel[key] === typeof err[key]
  );
}

export function asAppError(err: any): AppError {
  return isAppError(err) ? err : { type: "Unknown" };
}

export function throwAppError(error: AppError): never {
  throw error;
}

export type AppErrorHandler = (err: AppError) => boolean; // Return value indicates if the error was handled
