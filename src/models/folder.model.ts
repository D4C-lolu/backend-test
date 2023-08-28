import { DataTypes, Model, Optional } from "sequelize";
import { dbInstance } from "../db/connectToDB";
import User from "./user.model";


interface FolderAttributes {
  id: number;
  foldername: string;
  folderOwner: number;
  parentId?: number;
}

interface FolderCreationAttributes extends Optional<FolderAttributes, "id"> {}

class Folder extends Model<FolderAttributes, FolderCreationAttributes> implements FolderAttributes {
  public id!: number;
  public foldername!: string;
  public folderOwner!: number;
  public parentId?: number;
}

Folder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    foldername: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: {
          args: [2, 64],
          msg: "Folder name must be 2 - 64 characters long"
        }
      }
    },
    parentId : {
      type: DataTypes.INTEGER,
      references: {
        model: Folder,
        key: "id",
      },
    },
    folderOwner: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    modelName: "folder",
    indexes: [
      {
        unique: true,
        fields: ["parentId", "foldername", "folderOwner"]
      }
    ],
    sequelize: dbInstance,  
  }
);

Folder.belongsTo(Folder, { foreignKey: "parentId" });

User.hasMany(Folder);

Folder.belongsTo(User);


export default Folder;
export { FolderAttributes, FolderCreationAttributes };