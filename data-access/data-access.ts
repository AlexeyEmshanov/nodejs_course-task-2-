import { DataTypes, Sequelize } from "sequelize";
import fs from "fs";
import {createValidator} from "express-joi-validation";

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
  console.error('Unable to connect to th database', err);
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

User.sync().then(() => {
  console.log('Synchronizing complete')
});

//Validation
const validator = createValidator();

export { User, validator };

