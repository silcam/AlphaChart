import { Request } from "express";
import UserData from "../storage/UserData";
import { StoredUser } from "../../../client/src/models/User";

export async function currentUser(req: Request): Promise<StoredUser | null> {
  const currentUserEmail = req.session!.email;
  if (currentUserEmail) {
    const user = await UserData.user(currentUserEmail);
    return user;
  }
  return null;
}

export async function verifyLogin(
  req: Request,
  expUserId?: string
): Promise<StoredUser | null> {
  const user = await currentUser(req);
  if (!user) return null;
  if (expUserId && user._id !== expUserId) return null;
  return user;
}
