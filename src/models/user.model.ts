/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional} from "sequelize"; 
import { UserRole } from "../types"; 
import { dbInstance } from "../db/connectToDB";

interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
 

  public id!: number;
  public firstname!: string;
  public lastname!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: {
          args: [2, 64],
          msg: "First name must be 2 - 64 characters long"
        }
      }
    },
    lastname: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: {
          args: [2, 64],
          msg: "Last name must be 2 - 64 characters long"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(UserRole),
      validate: {
        isIn: [Object.values(UserRole)],
      },
      defaultValue : UserRole.USER
    },
  },
  {
    sequelize: dbInstance,
    modelName: "user",
  }

);


export { UserAttributes, UserCreationAttributes };
export default User;
