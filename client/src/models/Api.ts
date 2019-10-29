export const API_VERSION = 4;
export const OLD_API_STATUS_410 = 410;

export function apiPath(path: string) {
  return `/api/v/${API_VERSION}${path}`;
}