import express from "express";
import { ValidatedRequest, createValidator} from "express-joi-validation";
import { bodySchemaForUpdateUser, paramsSchemaForUpdateUser, UpdateUserSchema } from "../validation/patch.update-user.schema";
import { bodySchemaForCreatingUser, CreateUserSchema } from "../validation/post.create-user.schema";
import { querySchemaForSuggestedUser, SuggestedUserSchema } from "../validation/get.suggested-user.schema";
import * as fs from "fs";
import { DataTypes, Sequelize } from "sequelize";

const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`The application is running on ${port}`);
});

const sqlScript = fs.readFileSync('users.sql').toString();

//DB Connection
// const sequelize = new Sequelize('postgres://postgres:password1@localhost:5432/postgres', { dialect: "postgres" });
const sequelize = new Sequelize({
  database: 'postgres',
  username: 'postgres',
  password: 'password1',
  dialect: 'postgres',
});

try {
  //Should I move it to app.listen to get rid of IIFE
  (async function() {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');
  })();
} catch (err) {
  console.error('Unable to connect to th database', err)
}

sequelize.query(sqlScript)
  .then( ()=> console.log('SQL script from file has been read'))
  .catch( (err) => console.log('ERROR->> Some problems with reading SQL script from file', err));

//Models
const User = sequelize.define('User', {
  id: {
    type : DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  login: {
    type: DataTypes.TEXT
  },
  password: {
    type: DataTypes.TEXT
  },
  age: {
    type: DataTypes.INTEGER
  },
  isdeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: false,
});

// (async () => {
//   await sequelize.sync({ force: true });
// })();

User.sync().then(() => {
  console.log('Synchronizing complete')
});

//Validation
const validator = createValidator();

//Middlewares for handling requests
app.use(express.json()); //Body parser for requests

app.get('/', (req, res) => {
  res.send('Welcome to the test server!');
});

app.get('/users', async (req, res) => {
  const usersFormDB = await User.findAll();

  if (usersFormDB.length) {
    res.json(usersFormDB);
  } else {
    res.status(404)
      .json({message: `No users at database`})
  }
});

app.get('/users/:id', async (req, res) => {
  const requstedUserFromDB = await User.findAll({
    where: {
      id: req.params.id
    }
  });

  if (requstedUserFromDB.length) {
    res.json(requstedUserFromDB);
  } else {
    res.status(404)
      .json({message: `User with id ${req.params.id} not found`})
  }
});

app.get('/search', validator.query(querySchemaForSuggestedUser), async (req: ValidatedRequest<SuggestedUserSchema>, res) => {
  const searchSubstring = req.query.loginSubstring;
  const numberOfSearchEntity = req.query.limit;
  const result = await getAutoSuggestUsers(searchSubstring, numberOfSearchEntity);

  if (result.length > 0) {
    res.send(result)
  } else {
    res.status(400)
      .json({ message: `Users with substring \u201c${searchSubstring}\u201c at login doesn't exist at data base.`})
  }
})

app.post('/createUser', validator.body(bodySchemaForCreatingUser), async (req: ValidatedRequest<CreateUserSchema>, res) => {
  const userToDB = await User.create({ ...req.body });
  res.status(200)
    .json({message: `User was successfully created with ID ${userToDB.get('id')}!`})
});

app.patch('/users/:id', validator.body(bodySchemaForUpdateUser), validator.params(paramsSchemaForUpdateUser), async (req: ValidatedRequest<UpdateUserSchema>, res) => {
  const userToUpdateAtDB = await User.update( {...req.body}, { where: { id: req.params.id}});

  if (userToUpdateAtDB[0] > 0) {
    res.json({message: `User with ID: ${req.params.id} was successfully updated!`})
  } else {
    res.status(400)
      .json({message: `User with ID: ${req.params.id} doesn't exist`})
  }
});

app.delete('/users/:id', async (req, res) => {
  const userToDeleteFromDB = await User.update( { isdeleted: true}, { where: { id: req.params.id}});
  console.log('---->>>', userToDeleteFromDB)

  if (userToDeleteFromDB[0] > 0) {
    res.json({message: `User with ID: ${req.params.id} was successfully deleted!`})
  } else {
    res.status(400)
      .json({message: `User with ID: ${req.params.id} doesn't exist. Deleting is impossible!`})
  }
})

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


//-- psql postgres://zqihjoir:XLS_yqHxdfM_Xqf1kYGSe-8Dy3Bwd2rb@mouse.db.elephantsql.com/zqihjoir C:\aleksei_emshnov\Learning\nodejs_course_task-2\users.sql
