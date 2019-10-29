import { Request, Response, NextFunction } from "express";
import {
  API_VERSION,
  OLD_API_STATUS_410
} from "../../../client/src/models/Api";

const pattern = /\/api\/v\/(\d)/;

export default function apiVersion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const match = pattern.exec(req.path);
  if (match && parseInt(match[1]) !== API_VERSION) {
    res.status(OLD_API_STATUS_410).send(); // Status 410
  } else {
    next();
  }
}
