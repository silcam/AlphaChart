import Axios from "axios";
import { AppError, asAppError, AppErrorHandler } from "../AppError/AppError";
import {
  PostRoute,
  APIPost,
  APIGet,
  GetRoute,
  Params,
  apiPath,
  OLD_API_STATUS_410
} from "./Api";
import bannerSlice from "../banners/bannerSlice";
import { AppDispatch } from "../state/appState";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import loadingSlice from "./loadingSlice";
import { objKeys } from "../util/objectUtils";
import { networkConnectionLostAction } from "../state/networkSlice";

const defaultAxios = Axios.create({ timeout: 5000 });

export async function webGet<T extends GetRoute>(
  route: T,
  routeParams: APIGet[T][0] = {},
  getParams?: APIGet[T][1]
): Promise<APIGet[T][2] | null> {
  const finalRoute = apiPath(interpolateParams(route, routeParams));
  logRequest("GET", finalRoute);
  try {
    const response = await defaultAxios.get(finalRoute, { params: getParams });
    return response.data;
  } catch (err) {
    throwAppError(err);
    return null;
  }
}

export async function webPost<T extends PostRoute>(
  route: T,
  params: APIPost[T][0],
  data: APIPost[T][1]
): Promise<APIPost[T][2] | null> {
  const finalRoute = apiPath(interpolateParams(route, params));
  logRequest("POST", finalRoute);
  try {
    const response = await defaultAxios.post(finalRoute, data);
    return response.data;
  } catch (err) {
    throwAppError(err);
    return null;
  }
}

export async function postFile(route: string, name: string, file: File) {
  try {
    logRequest("GET", apiPath(route));
    const formData = new FormData();
    formData.append(name, file);
    const response = await defaultAxios.post(apiPath(route), formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (err) {
    throwAppError(err);
    return null;
  }
}

function logRequest(method: string, route: string) {
  console.log(`${method} ${route}`);
}

function throwAppError(err: any): never {
  let error: AppError;
  if (err.request && !err.response) error = { type: "No Connection" };
  else if (err.response && err.response.status == OLD_API_STATUS_410)
    error = { type: "Old API" };
  else if (err.response && err.response.status)
    error = {
      type: "HTTP",
      status: err.response.status,
      ...(err.response.data || {})
    };
  else error = { type: "Unknown" };
  throw error;
}

function interpolateParams(
  route: string,
  routeParams: Params,
  getParams?: Params
) {
  const path = Object.keys(routeParams).reduce(
    (route: string, key) => route.replace(`:${key}`, `${routeParams[key]}`),
    route
  );
  return getParams
    ? path +
        "?" +
        objKeys(getParams)
          .map(key => `key=${encodeURIComponent(getParams[key])}`)
          .join("&")
    : path;
}

function dispatchError(
  dispatch: AppDispatch,
  error: AppError,
  loader?: (dispatch: AppDispatch) => void
) {
  if (error.type == "No Connection")
    dispatch(networkConnectionLostAction(loader));
  else dispatch(bannerSlice.actions.add({ type: "Error", error }));
}

export function useLoad<T>(loader: (dispatch: AppDispatch) => Promise<T>) {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    doLoad(dispatch, loader);
  }, []);
}

function doLoad<T>(
  dispatch: AppDispatch,
  loader: (dispatch: AppDispatch) => Promise<T>
) {
  dispatch(loadingSlice.actions.addLoading());
  dispatch(loader)
    .catch(anyErr => {
      const err = asAppError(anyErr);
      dispatchError(dispatch, err, dispatch => doLoad(dispatch, loader));
    })
    .finally(() => {
      dispatch(loadingSlice.actions.subtractLoading());
    });
}

export function usePush<T, U>(
  pusher: (t: T) => (dispatch: AppDispatch) => Promise<U>,
  errorHandler: AppErrorHandler = () => false
): [(t: T) => Promise<U | undefined>, boolean] {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const push = async (t: T) => {
    setLoading(true);
    dispatch(loadingSlice.actions.addLoading());
    try {
      return await dispatch(pusher(t));
    } catch (anyErr) {
      const err = asAppError(anyErr);
      if (!errorHandler(err)) {
        dispatchError(dispatch, err);
      }
    } finally {
      setLoading(false);
      dispatch(loadingSlice.actions.subtractLoading());
    }
  };
  return [push, loading];
}
