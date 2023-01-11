import { User } from "../data-access/data-access";
import { IUser, IUserWithOptionalFields } from "../types/user_type";
import { Model } from "sequelize";

async function getAutoSuggestUsers(loginSubstring: string, limit: number) {
  const allUsersFromDB = await User.findAll();
  const filteredUsers = allUsersFromDB.filter((user => user.get().login.toLowerCase().includes(loginSubstring.toLowerCase())));
  const sortedUsers = filteredUsers.sort((userA, userB) => sortByLogin(userA.get().login, userB.get().login));
  return sortedUsers.slice(0, limit);
}

function sortByLogin(a: any, b: any) {
  if (a > b) {
    return 1;
  }

  if (a < b) {
    return  -1;
  }

  return 0;
}

async function getAllUsers(): Promise<Model<typeof User>[]> {
  return User.findAll();
}

async function getUserById(id: string): Promise<Model<typeof User>[]> {
  return User.findAll({
    where: {
      id: id
    }
  });
}

async function createUser(user: IUser): Promise<Model<typeof User>> {
  return User.create(user);
}

/**
 * TODO: Types. Don't work user: IUser, but with optional fields works well
 */
async function updateUser(user: IUserWithOptionalFields, id: string): Promise<[affectedCount: number]> {
  return User.update( user, { where: { id: id}});
}

async function deleteUser(id: string): Promise<[affectedCount: number]> {
  return User.update( { isdeleted: true }, { where: {id: id}})
}

export { getAutoSuggestUsers, getAllUsers, getUserById, createUser, updateUser, deleteUser };