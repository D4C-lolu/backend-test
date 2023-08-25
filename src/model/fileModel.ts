import { DataTypes, Model, Optional } from "sequelize";
import { dbInstance } from "../db/connectToDB";
import { FileStatus } from "../types";
import User from "./userModel";
import Folder from "./folderModel";


interface FileAttributes {
  id: number;
  filename: string;
  folderId: number;
  status: FileStatus;
  fileOwner: number;
}

interface FileCreationAttributes extends Optional<FileAttributes, "id"> {}

class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: number;
  public filename!: string;
  public folderId!: number;
  public status!: FileStatus;
  public fileOwner!: number;
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
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(FileStatus),
      validate: {
        isIn: [Object.values(FileStatus)],
        defaultValue : FileStatus.SAFE
      },
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
  { sequelize: dbInstance, 
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