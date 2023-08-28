import { DataTypes, Model, Optional } from "sequelize";
import { dbInstance } from "../db/connectToDB";
import { FileStatus } from "../types";
import User from "./user.model";
import Folder from "./folder.model";


interface FileAttributes {
  id: number;
  filename: string;
  folderId: number;
  status: FileStatus;
  fileOwner: number;
  key: string;
  location: string;
  filetype: string;
  filesize: number;
}

interface FileCreationAttributes extends Optional<FileAttributes, "id"> {}

class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: number;
  public filename!: string;
  public folderId!: number;
  public status!: FileStatus;
  public fileOwner!: number;
  public key!: string;
  public location!: string;
  public filetype!: string;
  public filesize!: number;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    filename: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: {
          args: [2, 64],
          msg: "File name must be 2 - 64 characters long"
        }
      }
    },
    folderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Folder,
        key: "id",
      },
    },
    filesize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      },
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(FileStatus),
      validate: {
        isIn: [Object.values(FileStatus)],
        
      },
      defaultValue : FileStatus.SAFE
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    filetype: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        len: {
          args: [2, 32],
          msg: "File type must be 1 - 32 characters long"
        }
      }
    },
    fileOwner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { 
    sequelize: dbInstance, 
    modelName: "file",
    indexes: [
      {
        unique: true,
        fields: ["folderId", "filename"]
      }
    ]
  }
);


File.belongsTo(User);
User.hasMany(File);

File.belongsTo(Folder);
Folder.hasMany(File);

export default File;
export {  FileAttributes , FileCreationAttributes };