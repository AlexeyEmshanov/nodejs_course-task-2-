import {IUser} from "../types/user_type";
import * as DAO from "../data-access/data-access";
import services from "../services";

const allUsersAtDB: IUser[] = [
  {
    id: "77098ffa-cfc2-428a-a9eb-ce064b918b92",
    login: "Alex",
    password: "UserAPassword",
    age: 38,
    isDeleted: false
  },
  {
    id: "7c655945-f3e6-4beb-80b9-188c896b3066",
    login: "Aleksei",
    password: "UserBPassword",
    age: 38,
    isDeleted: false
  },
  {
    id: "199305fb-af58-4e0d-9728-d9bc26dc980c",
    login: "Aurora",
    password: "UserCPassword",
    age: 8,
    isDeleted: false
  },
  {
    id: "090cb9c2-2cc5-4f50-b2df-0f6257853056",
    login: "Agata",
    password: "UserDPassword",
    age: 6,
    isDeleted: false
  },
  {
    id: "9068ae85-e98e-48e6-9077-8ef27684317c",
    login: "Aleksandra",
    password: "UserEPassword",
    age: 38,
    isDeleted: false
  }
]


jest.mock('../data-access/data-access');


describe('Testing with integration tests', () => {
  describe('Testing getAllUsersFromDB method', () => {
    test('It should return all existed users in the DB', async () => {
      (DAO.User.findAll as jest.Mock).mockResolvedValue(allUsersAtDB);

      const usersFromDB = await services.getAllUsersFromDB()
      expect(usersFromDB.length).toBe(5);
    })
  })

  describe('Testing createUserAtDB method', () => {
    test('It should create new user, and amount of user should increase by 1', async () => {
      const newUser = {
        id: 'cf70625f-a0fc-4db1-af5b-b6edaac1c591',
        login: 'NewUser',
        password: 'NewUserPassword',
        age: 19,
        isDeleted: false
      };

      let usersFromDB = await services.getAllUsersFromDB()
      expect(usersFromDB.length).toBe(allUsersAtDB.length);

      (DAO.User.create as jest.Mock).mockImplementation(() => {
        allUsersAtDB.push(newUser)
      });

      await services.createUserAtDB(newUser)

      usersFromDB = await services.getAllUsersFromDB()
      expect(usersFromDB.length).toBe(6);
    })
  })
});