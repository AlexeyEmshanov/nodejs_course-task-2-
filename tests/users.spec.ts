import { Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { GetUserByIdSchema } from "../validation/users_validation/get.user.schema";
import services from "../services";
import makeUserController, {Users_Controller_Type} from "../api/controllers/users_controller";
import {sequelize} from "../data-access/data-access";

// beforeAll(done => {
//   // sequelize.sync()
//   done()
// })
//
// afterEach(done => {
//   // Closing the DB connection allows Jest to exit successfully.
//   sequelize.close().then(() => done())
//
// })


//Mocking
jest.mock("../services");
const userController = makeUserController(services);

const response = {
  status: jest.fn((x: number) => {
    return response
  }),
  json: jest.fn((x) => x)
} as unknown as Response;

const next = jest.fn(x => x)

const allUsersAtDB = [
  {
    id: "77098ffa-cfc2-428a-a9eb-ce064b918b92",
    login: "Alex",
    password: "UserAPassword",
    age: 38,
    isdeleted: false
  },
  {
    id: "7c655945-f3e6-4beb-80b9-188c896b3066",
    login: "Aleksei",
    password: "UserBPassword",
    age: 38,
    isdeleted: false
  },
  {
    id: "199305fb-af58-4e0d-9728-d9bc26dc980c",
    login: "Aurora",
    password: "UserCPassword",
    age: 8,
    isdeleted: false
  },
  {
    id: "090cb9c2-2cc5-4f50-b2df-0f6257853056",
    login: "Agata",
    password: "UserDPassword",
    age: 6,
    isdeleted: false
  },
  {
    id: "9068ae85-e98e-48e6-9077-8ef27684317c",
    login: "Aleksandra",
    password: "UserEPassword",
    age: 38,
    isdeleted: false
  }
]

const existedUserFromDB = allUsersAtDB[0];

const mockErr = new Error('Mock error');

describe('Testing Users Controller', () => {

  describe('Testing GET on /users path with getUsers', () => {
    //Block for mocking special condition for Response, Request
    const request = {} as ValidatedRequest<GetUserByIdSchema>;

    test('It should send a status 200 if any users at DB exist', async () => {
      (userController.services.getAllUsersFromDB as jest.Mock).mockReturnValueOnce(allUsersAtDB);

      await userController.getAllUsersControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(200);
    })

    test('It should send an array of JSON objects with certain length, with all users at DB', async () => {
      (userController.services.getAllUsersFromDB as jest.Mock).mockImplementation(() => allUsersAtDB);
      const users = await userController.services.getAllUsersFromDB()

      await userController.getAllUsersControllerMethod(request, response, () => {})
      expect(response.json).toHaveBeenCalledWith(allUsersAtDB);
      expect(users.length).toBe(allUsersAtDB.length);
    })

    test('It should send a status 404 if users in DB does not exist', async () => {
      (userController.services.getAllUsersFromDB as jest.Mock).mockReturnValueOnce([]);

      await userController.getAllUsersControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({message: "No users at database"});
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      (userController.services.getAllUsersFromDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await userController.getAllUsersControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing GET on /users/:id path with getUserByIDControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      params: {
        id: '77098ffa-cfc2-428a-a9eb-ce064b918b92'
      },
    } as ValidatedRequest<GetUserByIdSchema>;

    test('It should send a status 200 if user exist', async () => {
      (userController.services.getUserByIdFromDB as jest.Mock).mockReturnValueOnce([existedUserFromDB]);

      await userController.getUserByIDControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(200);
    })

    test('It should send a status 404 if user not exist', async () => {
      (userController.services.getUserByIdFromDB as jest.Mock).mockReturnValueOnce([]);

      await userController.getUserByIDControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(404);
    })

    test('It should send a JSON with existed user with same ID', async () => {
      (userController.services.getUserByIdFromDB as jest.Mock).mockReturnValueOnce([existedUserFromDB]);

      await userController.getUserByIDControllerMethod(request, response, () => {})
      expect(request.params.id).toBe(existedUserFromDB.id);
      expect(response.json).toHaveBeenCalledWith([existedUserFromDB]);
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      const mockErr = new Error('Mock error');
      (userController.services.getUserByIdFromDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await userController.getUserByIDControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing POST on /users path with createUserControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      body: {
        login: "NewUser",
        password: "NewUserPassword",
        age: 19
      },
    } as ValidatedRequest<GetUserByIdSchema>;

    const createdUser = {
      id: 'cf70625f-a0fc-4db1-af5b-b6edaac1c591',
      login: 'NewUser',
      password: 'NewUserPassword',
      age: 19,
      isdeleted: false
    }

    test('It should send a status 201 if new user successfully created at DB', async () => {
      (userController.services.createUserAtDB as jest.Mock).mockReturnValueOnce(createdUser);

      await userController.createUserControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(201);
      // expect(response.json).toHaveBeenCalled();
    })

    test('It should send a status 400 if user was not created and send particular error message', async () => {
      (userController.services.createUserAtDB as jest.Mock).mockReturnValueOnce(null);

      await userController.createUserControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({message: "In the process of User creation something went wrong..."});
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      (userController.services.createUserAtDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await userController.createUserControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing PUT on /users/:id path with updateUserControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      params: {
        id: '77098ffa-cfc2-428a-a9eb-ce064b918b92'
      },
    } as ValidatedRequest<GetUserByIdSchema>;

    const updatedUserInfo = {
      login: 'UpdatedUser',
      age: 55
    }

    test('It should send a status 200 and certain message if user was successfully updated at DB', async () => {
      (userController.services.updateUserAtDB as jest.Mock).mockReturnValueOnce([1]);

      await userController.updateUserControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({message: `User with ID: ${request.params.id} was successfully updated!`});
    })

    test('It should send a status 400 if user was not updated and send particular error message', async () => {
      (userController.services.updateUserAtDB as jest.Mock).mockReturnValueOnce([0]);

      await userController.updateUserControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({message: `User with ID: ${request.params.id} doesn't exist`});
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      (userController.services.updateUserAtDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await userController.updateUserControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing DELETE on /users/:id path with deleteUserControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      params: {
        id: '77098ffa-cfc2-428a-a9eb-ce064b918b92'
      },
    } as ValidatedRequest<GetUserByIdSchema>;

    test('It should send a status 200 and certain message if user was successfully deleted at DB', async () => {
      (userController.services.deleteUserAtDB as jest.Mock).mockReturnValueOnce([1]);

      await userController.deleteUserControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({message: `User with ID: ${request.params.id} was successfully deleted!`});
    })

    test('It should send a status 400 if user was not deleted and send particular error message', async () => {
      (userController.services.deleteUserAtDB as jest.Mock).mockReturnValueOnce([0]);

      await userController.deleteUserControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({message: `User with ID: ${request.params.id} doesn't exist. Deleting is impossible!`});
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      (userController.services.deleteUserAtDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await userController.deleteUserControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing GET on /search path with searchUserControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      query: {
        loginSubstring: 'aleks',
        limit: 10
      },
    } as ValidatedRequest<GetUserByIdSchema>;

    const searchResult = [
      {
        "id": "9068ae85-e98e-48e6-9077-8ef27684317c",
        "login": "Aleksandra",
        "password": "UserEPassword",
        "age": 38,
        "isdeleted": false
      },
      {
        "id": "7c655945-f3e6-4beb-80b9-188c896b3066",
        "login": "Aleksei",
        "password": "UserBPassword",
        "age": 38,
        "isdeleted": false
      }
    ]

    test('It should send a status 200 if suggested results exists at DB', async () => {
      (userController.services.getAutoSuggestUsersFromDB as jest.Mock).mockReturnValueOnce(searchResult);

      await userController.searchUserControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(200);
    })

    test('It should send an array with suggested users at DB', async () => {
      (userController.services.getAutoSuggestUsersFromDB as jest.Mock).mockReturnValueOnce(searchResult);

      await userController.searchUserControllerMethod(request, response, () => {})
      expect(response.json).toHaveBeenCalledWith(searchResult);
    })

    test('It should send a status 400 if any users with requested substring at login does not exist at DB', async () => {
      (userController.services.getAutoSuggestUsersFromDB as jest.Mock).mockReturnValueOnce([]);

      await userController.searchUserControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({message: `Users with substring \u201c${request.query.loginSubstring}\u201c at login doesn't exist at data base.`});
    })
    //
    test('It should call next function with error object if unexpected error happens', async () => {
      (userController.services.getAutoSuggestUsersFromDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await userController.searchUserControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })
})
