import { Request } from "express";
import UserData from "../storage/UserData";
import { StoredUser } from "../../../client/src/models/User";
import { ObjectId, ObjectID } from "mongodb";

export async function currentUser(req: Request): Promise<StoredUser | null> {
  const currentUserId: string | undefined = req.session!.userId;
  if (currentUserId) {
    const user = await UserData.user(new ObjectID(currentUserId));
    return user;
  }
  return null;
}

export async function verifyLogin(
  req: Request,
  expUserId?: ObjectId
): Promise<StoredUser | null> {
  const user = await currentUser(req);
  if (!user) return null;
  if (expUserId && !user._id.equals(expUserId)) return null;
  return user;
}
