import {User, Group, UserGroups, sequelize} from "../data-access/data-access";
import { IUser, IUserWithOptionalFields } from "../types/user_type";
import { Model } from "sequelize";
import { IGroup } from "../types/group_type";
import jwt from "jsonwebtoken";

//USER SERVICES
async function getAutoSuggestUsersFromDB(loginSubstring: string, limit: number) {
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

async function getAllUsersFromDB(): Promise<Model<typeof User>[]> {
  return User.findAll();
}

async function getUserByIdFromDB(id: string): Promise<Model<typeof User>[]> {
  return User.findAll({ where: { id: id } });
}

async function createUserAtDB(user: IUser): Promise<Model<typeof User>> {
  return User.create(user);
}

/**
 * TODO: Types. Don't work user: IUser, but with optional fields works well
 */
async function updateUserAtDB(user: IUserWithOptionalFields, id: string): Promise<[affectedCount: number]> {
  return User.update(user, { where: { id: id}});
}

async function deleteUserAtDB(id: string): Promise<[affectedCount: number]> {
  return User.update( { isdeleted: true }, { where: {id: id}})
}

async function getUserWithCredentials(login: string, password: string): Promise<Model<typeof User>[]> {
  return User.findAll({where: {login: login, password: password}})
}


//GROUP SERVICES
async function getAllGroupsFromDB(): Promise<Model<typeof Group>[]> {
  return Group.findAll();
}

async function getGroupByIdFromDB(id: string): Promise<Model<typeof Group>[]> {
  return Group.findAll({ where: { id: id } });
}

async function createGroupAtDB(group: IGroup): Promise<Model<typeof Group>> {
  return Group.create(group);
}

async function updateGroupAtDB(group: IGroup, id: string): Promise<[affectedCount: number]> {
  return Group.update(group, { where: { id: id}});
}

async function deleteGroupAtDB(id: string): Promise<number> {
  return Group.destroy({
    where: {id: id},
    force: true
  })
}

async function addUsersToGroup(groupId: string, userId: string) {
  return sequelize.transaction(async () => {
    return UserGroups.create({
      GroupId: groupId,
      UserId: userId
    });
  })
}

async function findUsersAtGroup(groupId: string) {
  return Group.findAll({
    where: {
      id: groupId
    },
    include: User
  })
}

//JWT
function generateAccessToken(payload:  string | object): string {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY_FOR_JWT as string, {expiresIn: 30});
}

function generateRefreshToken(payload:  string | object): string {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY_FOR_JWT as string, {expiresIn: 300});
}


export type App_Services_Type = {
  getAutoSuggestUsersFromDB: typeof getAutoSuggestUsersFromDB,
  getAllUsersFromDB: typeof getAllUsersFromDB,
  getUserByIdFromDB: typeof getUserByIdFromDB,
  createUserAtDB: typeof createUserAtDB,
  updateUserAtDB: typeof updateUserAtDB,
  deleteUserAtDB: typeof deleteUserAtDB,
  getUserWithCredentials: typeof getUserWithCredentials,
  getAllGroupsFromDB: typeof getAllGroupsFromDB,
  getGroupByIdFromDB: typeof getGroupByIdFromDB,
  createGroupAtDB: typeof createGroupAtDB,
  updateGroupAtDB: typeof updateGroupAtDB,
  deleteGroupAtDB: typeof deleteGroupAtDB,
  addUsersToGroup: typeof addUsersToGroup,
  findUsersAtGroup: typeof findUsersAtGroup,
  generateAccessToken: typeof generateAccessToken,
  generateRefreshToken: typeof generateRefreshToken
}

export default {
  getAutoSuggestUsersFromDB, getAllUsersFromDB, getUserByIdFromDB, createUserAtDB, updateUserAtDB, deleteUserAtDB, getUserWithCredentials,
  getAllGroupsFromDB, getGroupByIdFromDB, createGroupAtDB, updateGroupAtDB, deleteGroupAtDB, addUsersToGroup, findUsersAtGroup,
  generateAccessToken, generateRefreshToken
};