import { DataTypes, Model, Optional } from "sequelize";
import { dbInstance } from "../db/connectToDB";
import User from "./user.model";


interface FolderAttributes {
  id: number;
  foldername: string;
  path: string;
  folderOwner: number;
}

interface FolderCreationAttributes extends Optional<FolderAttributes, "id"> {}

class Folder extends Model<FolderAttributes, FolderCreationAttributes> implements FolderAttributes {
  public id!: number;
  public foldername!: string;
  public path!: string;
  public folderOwner!: number;
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
    path: { type: DataTypes.STRING, allowNull: false },
    folderOwner: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { sequelize: dbInstance, 
    modelName: "folder"
  }
);

const folderRelationship = dbInstance.define("folder_relationship", {});

Folder.belongsToMany(Folder, { through: folderRelationship, as: "child", foreignKey: "childId" });
Folder.belongsToMany(Folder, { through: folderRelationship, as: "parent", foreignKey: "parentId" });

User.hasMany(Folder);

Folder.belongsTo(User);




export default Folder;