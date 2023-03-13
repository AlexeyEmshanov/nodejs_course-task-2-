import makeGroupController from "../api/controllers/groups_controller";
import services from "../services";
import { Request, Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { GetGroupByIdSchema } from "../validation/groups_validation/get.group.schema";
import { CreateGroupSchema } from "../validation/groups_validation/post.create-group.schema";
import { UpdateGroupSchema } from "../validation/groups_validation/put.update-group.schema";

//Mocking
jest.mock("../services");
const groupController = makeGroupController(services);

const response = {
  status: jest.fn((x: number) => {
    return response
  }),
  json: jest.fn((x) => x)
} as unknown as Response;

const next = jest.fn(x => x)

const allGroupsAtDB = [
  {
    "id": "0db8327d-fa5f-482c-9023-e6476eb3402a",
    "name": "Admins",
    "permission": [
      "READ",
      "WRITE",
      "DELETE",
      "SHARE",
      "UPLOAD_FILES"
    ]
  },
  {
    "id": "f3b7e3b4-9301-4e09-8450-2e647c40f217",
    "name": "Users",
    "permission": [
      "READ",
      "WRITE",
      "SHARE"
    ]
  },
  {
    "id": "64df4a8e-a02b-4426-a888-9610f4a81494",
    "name": "VIP Users",
    "permission": [
      "READ",
      "WRITE",
      "SHARE",
      "UPLOAD_FILES"
    ]
  }
]

const existedGroupFromDB = allGroupsAtDB[0];

const mockErr = new Error('Mock error');


describe('Testing Groups Controller', () => {

  describe('Testing GET on /groups path with getAllGroupsControllerMethod', () => {
    //Block for mocking special condition for Response, Request
    const request = {} as Request;

    test('It should send a status 200 if any groups at DB exist', async () => {
      (groupController.services.getAllGroupsFromDB as jest.Mock).mockReturnValueOnce(allGroupsAtDB);

      await groupController.getAllGroupsControllerMethod(request, response, () => {
      })
      expect(response.status).toHaveBeenCalledWith(200);
    })

    test('It should send an array of JSON objects with certain length, with all groups at DB', async () => {
      (groupController.services.getAllGroupsFromDB as jest.Mock).mockImplementation(() => allGroupsAtDB);
      const groups = await groupController.services.getAllGroupsFromDB()

      await groupController.getAllGroupsControllerMethod(request, response, () => {
      })
      expect(response.json).toHaveBeenCalledWith(allGroupsAtDB);
      expect(groups.length).toBe(allGroupsAtDB.length);
    })

    test('It should send a status 404 if groups in DB does not exist', async () => {
      (groupController.services.getAllGroupsFromDB as jest.Mock).mockReturnValueOnce([]);

      await groupController.getAllGroupsControllerMethod(request, response, () => {
      })
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({message: `No groups at database`});
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      (groupController.services.getAllGroupsFromDB as jest.Mock).mockImplementation(() => { throw mockErr });

      await groupController.getAllGroupsControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing GET on /groups/:id path with getGroupByIdControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      params: {
        id: '0db8327d-fa5f-482c-9023-e6476eb3402a'
      },
    } as ValidatedRequest<GetGroupByIdSchema>;

    test('It should send a status 200 if group exist', async () => {
      (groupController.services.getGroupByIdFromDB as jest.Mock).mockReturnValueOnce([existedGroupFromDB]);

      await groupController.getGroupByIdControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(200);
    })

    test('It should send a status 404 if group not exist', async () => {
      (groupController.services.getGroupByIdFromDB as jest.Mock).mockReturnValueOnce([]);

      await groupController.getGroupByIdControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(404);
    })

    test('It should send a JSON with existed group with same ID', async () => {
      (groupController.services.getGroupByIdFromDB as jest.Mock).mockReturnValueOnce([existedGroupFromDB]);

      await groupController.getGroupByIdControllerMethod(request, response, () => {})
      expect(request.params.id).toBe(existedGroupFromDB.id);
      expect(response.json).toHaveBeenCalledWith([existedGroupFromDB]);
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      const mockErr = new Error('Mock error');
      (groupController.services.getGroupByIdFromDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await groupController.getGroupByIdControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing POST on /groups path with createGroupAtDBControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      body: {
        name: "Tigers",
        permission: ["READ", "WRITE"],
      },
    } as ValidatedRequest<CreateGroupSchema>;

    const createdGroup = {
      id: "fc10a330-b088-494b-baaf-a59dad5f255a",
      name: "Tigers",
      permission: ["READ", "WRITE"],
    }

    test('It should send a status 201 if new group successfully created at DB', async () => {
      (groupController.services.createGroupAtDB as jest.Mock).mockReturnValueOnce(createdGroup);

      await groupController.createGroupAtDBControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(201);
      // expect(response.json).toHaveBeenCalled();
    })

    test('It should send a status 400 if group was not created and send particular error message', async () => {
      (groupController.services.createGroupAtDB as jest.Mock).mockReturnValueOnce(null);

      await groupController.createGroupAtDBControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({message: "In the process of Group creation something went wrong..."});
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      (groupController.services.createGroupAtDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await groupController.createGroupAtDBControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing PUT on /groups/:id path with updateGroupControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      params: {
        id: '0db8327d-fa5f-482c-9023-e6476eb3402a'
      },
    } as ValidatedRequest<UpdateGroupSchema>;

    const updatedGroupInfo = {
      name: "MegaAdmins",
      permission: [
        "READ",
        "WRITE",
        "DELETE",
        "UPLOAD_FILES"
      ]
    }

    test('It should send a status 200 and certain message if group was successfully updated at DB', async () => {
      (groupController.services.updateGroupAtDB as jest.Mock).mockReturnValueOnce([1]);

      await groupController.updateGroupControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({message: `Group with ID: ${request.params.id} was successfully updated!`});
    })

    test('It should send a status 400 if group was not updated and send particular error message', async () => {
      (groupController.services.updateGroupAtDB as jest.Mock).mockReturnValueOnce([0]);

      await groupController.updateGroupControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({message: `Group with ID: ${request.params.id} doesn't exist`});
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      (groupController.services.updateGroupAtDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await groupController.updateGroupControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })


  describe('Testing DELETE on /groups/:id path with deleteGroupControllerMethod' , () => {
    //Block for mocking special condition for Response, Request
    const request = {
      params: {
        id: '0db8327d-fa5f-482c-9023-e6476eb3402a'
      },
    } as ValidatedRequest<GetGroupByIdSchema>;

    test('It should send a status 200 and certain message if group was successfully deleted at DB', async () => {
      (groupController.services.deleteGroupAtDB as jest.Mock).mockReturnValueOnce([1]);

      await groupController.deleteGroupControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({message: `Group with ID: ${request.params.id} was successfully deleted!`});
    })

    test('It should send a status 400 if group was not deleted and send particular error message', async () => {
      (groupController.services.deleteGroupAtDB as jest.Mock).mockReturnValueOnce([0]);

      await groupController.deleteGroupControllerMethod(request, response, () => {})
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith({message: `Group with ID: ${request.params.id} doesn't exist. Deleting is impossible!`});
    })

    test('It should call next function with error object if unexpected error happens', async () => {
      (groupController.services.deleteGroupAtDB as jest.Mock).mockImplementation(() => {throw mockErr});

      await groupController.deleteGroupControllerMethod(request, response, next)
      expect(next).toHaveBeenCalledWith(mockErr);
    })
  })
})