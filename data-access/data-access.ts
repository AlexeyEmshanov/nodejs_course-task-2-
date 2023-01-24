import {DataTypes, Sequelize, TEXT} from "sequelize";
import fs from "fs";
import {createValidator} from "express-joi-validation";

const sqlScriptForUsers = fs.readFileSync('./scripts/users.sql').toString();
const sqlScriptForGroups = fs.readFileSync('./scripts/groups.sql').toString();

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
  console.error('Unable to connect to the database', err);
}

sequelize.query(sqlScriptForUsers)
  .then( ()=> console.log('SQL script from file for mock users has been read'))
  .catch( (err) => console.log('ERROR->> Some problems with reading SQL script from file for mock users', err));

sequelize.query(sqlScriptForGroups)
  .then( ()=> console.log('SQL script from file for mock groups has been read'))
  .catch( (err) => console.log('ERROR->> Some problems with reading SQL script from file for mock groups', err));

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
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.TEXT
    },
    permission: {
      type: DataTypes.ARRAY(TEXT)
    }
  },
  {
    tableName: 'groups',
    timestamps: false,
  }
);

User.sync().then(() => {
  console.log('User model synchronizing completed')
});

Group.sync().then(() => {
  console.log('Group model synchronizing completed')
});

//Validation
const validator = createValidator();

export { User, Group, validator };

