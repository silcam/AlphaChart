import { Request } from "express";
import UserData from "../storage/UserData";
import { StoredUser } from "../../../client/src/models/User";

export default async function currentUser(
  req: Request
): Promise<StoredUser | null> {
  const currentUserEmail = req.session!.email;
  if (currentUserEmail) {
    const user = await UserData.user(currentUserEmail);
    return user;
  }
  return null;
}
