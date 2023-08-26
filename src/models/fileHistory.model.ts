import { DataTypes, Model, Optional } from "sequelize";
import { dbInstance } from "../db/connectToDB";
import User from "./user.model";
import File from "./file.model";
import { FileAction } from "../types";


interface FileHistoryAttributes {
  id: number;
  fileId: number;
  userId: number;
  timestamp: Date;
  action : FileAction;
  oldValue : string;
  newValue : string;
}

interface FileHistoryCreationAttributes extends Optional<FileHistoryAttributes, "id"> {}

class FileHistory extends Model<FileHistoryAttributes, FileHistoryCreationAttributes> implements FileHistoryAttributes {
  public id!: number;
  public fileId!: number;
  public userId!: number;
  public timestamp!: Date;
  public action!: FileAction;
  public oldValue!: string;
  public newValue!: string;
}

FileHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: File,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    action: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: Object.values(FileAction),
      validate: {
        isIn: [Object.values(FileAction)],
      },
    },
    oldValue: {
      type: DataTypes.STRING,
    },
    newValue: {
      type: DataTypes.STRING,
    }
  },
  { sequelize: dbInstance, 
    modelName: "file_history"
  }
);


FileHistory.belongsTo(User);

FileHistory.belongsTo(File);


export default FileHistory;