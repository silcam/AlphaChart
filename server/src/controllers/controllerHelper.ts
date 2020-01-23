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

export async function currentUserStrict(
  req: Request,
  idFilter?: ObjectId[]
): Promise<StoredUser> {
  const user = await currentUser(req);
  if (!user) throw { status: 401 };
  if (idFilter && !idFilter.some(id => id.equals(user._id)))
    throw { status: 401 };
  return user;
}

export async function getById<T>(
  _id: any,
  get: (_id: ObjectId) => Promise<T | null> /*, toThrow: any = {status: 404} */
) {
  try {
    const item = await get(new ObjectID(_id));
    if (!item) throw { status: 404 };
    return item;
  } catch (e) {
    throw { status: 404 };
  }
}
