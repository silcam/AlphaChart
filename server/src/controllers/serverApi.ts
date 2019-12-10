import {
  GetRoute,
  PostRoute,
  APIPost,
  APIGet,
  apiPath
} from "../../../client/src/api/Api";
import { Express, Request, Response } from "express";

export type GetRequestHandler<T extends GetRoute> = (
  req: Request
) => Promise<APIGet[T][1]>;
export type PostRequestHandler<T extends PostRoute> = (
  req: Request
) => Promise<APIPost[T][2]>;

export function addGetHandler<T extends GetRoute>(
  app: Express,
  route: T,
  handler: GetRequestHandler<T>
) {
  app.get(apiPath(route), async (req, res) => {
    try {
      const result = await handler(req);
      res.json(result);
    } catch (err) {
      errorResponse(res, err);
    }
  });
}

export function addPostHandler<T extends PostRoute>(
  app: Express,
  route: T,
  handler: PostRequestHandler<T>
) {
  app.post(apiPath(route), async (req, res) => {
    try {
      const result = await handler(req);
      res.json(result);
    } catch (err) {
      errorResponse(res, err);
    }
  });
}

function errorResponse(res: Response, err: any) {
  const status = err.status || 500;
  const response = err.response || {};
  res.status(status).send(response);
}
