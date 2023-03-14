import {DataTypes, Sequelize, TEXT} from "sequelize";
import {createValidator} from "express-joi-validation";
import * as dotenv from "dotenv";

dotenv.config();

//DB Connection
// const sequelize = new Sequelize(process.env.CONNECTION_STRING_VARIABLE as string , { dialect: "postgres", logging: false });
const sequelize = new Sequelize({
  database: process.env.DATABASE_VARIABLE,
  username: process.env.USERNAME_VARIABLE,
  password: process.env.PASSWORD_VARIABLE,
  port: Number(process.env.PORT_VARIABLE),
  dialect: 'postgres',
  logging: false
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

//Models
const User = sequelize.define('Users', {
    id: {
      type : DataTypes.UUID,
      primaryKey: true,
      unique: true,
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
    tableName: 'Users',
    timestamps: false,
  }
);

const Group = sequelize.define('Groups', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    name: {
      type: DataTypes.TEXT
    },
    permission: {
      type: DataTypes.ARRAY(TEXT)
    }
  },
  {
    tableName: 'Groups',
    timestamps: false,
  }
);

// Many-To-Many
const UserGroups = sequelize.define('UserGroups', {
  UserId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    },
  },
  GroupId: {
    type: DataTypes.UUID,
    references: {
      model: Group,
      key: 'id'
    },
  },

  }, {
    tableName: 'UserGroups',
    timestamps: false
})

//Default values for many-to-many tables for onDelete, onUpdate properties - CASCADE, so we can get rid of it
User.belongsToMany(Group, {through: 'UserGroups', onDelete: 'CASCADE' });
Group.belongsToMany(User, {through: 'UserGroups', onDelete: 'CASCADE' });

sequelize.sync().then(() => {
  console.log('All models synchronizing completed')


})

//Validation
const validator = createValidator();

export { User, Group, UserGroups, validator, sequelize };
