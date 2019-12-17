import UserData from "../storage/UserData";
import AlphabetData from "../storage/AlphabetData";
import { ObjectID } from "bson";
import cannotEditAlphabet, {
  cannotControlAlphabet
} from "./cannotEditAlphabet";
import Data from "../storage/Data";

beforeAll(Data.loadFixtures);
afterAll(Data.deleteDatabase);

test("Titus can edit and control his own alphabet", async () => {
  expect.assertions(2);
  const titus = await UserData.userByEmail("titus@yahoo.com");
  const ellenika = await AlphabetData.alphabet(
    new ObjectID("5d4c38e158e6dbb33d7d7b12")
  );
  expect(await cannotEditAlphabet(titus!, ellenika!)).toBe(false);
  expect(await cannotControlAlphabet(titus!, ellenika!)).toBe(false);
});

test("Titus can edit and control alphabet if he's in the group that owns it", async () => {
  expect.assertions(2);
  const titus = await UserData.userByEmail("titus@yahoo.com");
  const bana = await AlphabetData.alphabet(
    new ObjectID("789def789def789def789def")
  );
  expect(await cannotEditAlphabet(titus!, bana!)).toBe(false);
  expect(await cannotControlAlphabet(titus!, bana!)).toBe(false);
});

test("Titus can edit alphabet but not control it if he's on the users list", async () => {
  expect.assertions(2);
  const titus = await UserData.userByEmail("titus@yahoo.com");
  const gude = await AlphabetData.alphabet(
    new ObjectID("123abc123abc123abc123abc")
  );
  expect(await cannotEditAlphabet(titus!, gude!)).toBe(false);
  expect(await cannotControlAlphabet(titus!, gude!)).toBe(true);
});

test("Lucy can't edit or control alphabet without permission", async () => {
  expect.assertions(2);
  const lucy = await UserData.userByEmail("lucy@me.com");
  const ellenika = await AlphabetData.alphabet(
    new ObjectID("5d4c38e158e6dbb33d7d7b12")
  );
  expect(await cannotEditAlphabet(lucy!, ellenika!)).toBe(true);
  expect(await cannotControlAlphabet(lucy!, ellenika!)).toBe(true);
});
