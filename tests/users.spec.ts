import app from "../app/app";
// import {getAllUsersFromDB, getUserByIdFromDB} from "../services";
import {NextFunction, Request, Response} from "express";
// import { getUserByIDController } from "../api/controllers/users_controller";
import {ValidatedRequest} from "express-joi-validation";
import {GetUserByIdSchema} from "../validation/users_validation/get.user.schema";
import services, {App_Services_Type} from "../services";
import makeUserController, {Users_Controller_Type} from "../api/controllers/users_controller";
import {sequelize} from "../data-access/data-access";


jest.mock("../services");
const userController = makeUserController(services);


beforeAll(done => {
  done()
})

afterAll(done => {
  // Closing the DB connection allows Jest to exit successfully.
  sequelize.close()
  done()
})

const request = {
  params: {
    id: '123'
  },
} as ValidatedRequest<GetUserByIdSchema>;

const response = {
  status: jest.fn((x: number) => {
    console.log('*** response.status called')
    return x
  }),
} as unknown as Response;


test('It should send a status 404 if user not exist', async () => {
  await (userController.services.getUserByIdFromDB as jest.Mock).mockReturnValueOnce([]);

  await userController.getUserByIDController(request, response, () => {})
  console.log('*** test started-4')
  expect(response.status).toHaveBeenCalledWith(404);
})

// export function abc(services) {
//   return {
//     getUserByIDController
//   }
// }