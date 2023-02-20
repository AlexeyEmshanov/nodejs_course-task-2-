import {User, Group, UserGroups, sequelize} from "../data-access/data-access";
import { IUser, IUserWithOptionalFields } from "../types/user_type";
import { Model } from "sequelize";
import { IGroup } from "../types/group_type";

//USER SERVICES
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
  return User.findAll({ where: { id: id } });
}

async function createUser(user: IUser): Promise<Model<typeof User>> {
  return User.create(user);
}

/**
 * TODO: Types. Don't work user: IUser, but with optional fields works well
 */
async function updateUser(user: IUserWithOptionalFields, id: string): Promise<[affectedCount: number]> {
  return User.update(user, { where: { id: id}});
}

async function deleteUser(id: string): Promise<[affectedCount: number]> {
  return User.update( { isdeleted: true }, { where: {id: id}})
}

async function getUserWithCredentials(login: string, password: string): Promise<Model<typeof User>[]> {
  return User.findAll({where: {login: login, password: password}})
}


//GROUP SERVICES
async function getAllGroups(): Promise<Model<typeof Group>[]> {
  return Group.findAll();
}

async function getGroupById(id: string): Promise<Model<typeof Group>[]> {
  return Group.findAll({ where: { id: id } });
}

async function createGroup(group: IGroup): Promise<Model<typeof Group>> {
  return Group.create(group);
}

async function updateGroup(group: IGroup, id: string): Promise<[affectedCount: number]> {
  return Group.update(group, { where: { id: id}});
}

async function deleteGroup(id: string): Promise<number> {
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

export { getAutoSuggestUsers, getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserWithCredentials, getAllGroups, getGroupById, createGroup, updateGroup, deleteGroup, addUsersToGroup, findUsersAtGroup };