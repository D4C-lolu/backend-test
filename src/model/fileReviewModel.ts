import { DataTypes, Model, Optional } from "sequelize";
import { dbInstance } from "../db/connectToDB";
import User from "./userModel";
import File from "./fileModel";



interface FileReviewAttributes {
  id: number;
  fileId: number;
  userId: number;
  timestamp: Date;
}

interface FileReviewCreationAttributes extends Optional<FileReviewAttributes, "id"> {}

class FileReview extends Model<FileReviewAttributes, FileReviewCreationAttributes> implements FileReviewAttributes {
  public id!: number;
  public fileId!: number;
  public userId!: number;
  public timestamp!: Date;
}

FileReview.init(
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
    }
  },
  { sequelize: dbInstance, 
    modelName: "file_review",
    indexes: [
      {
        unique: true,
        fields: ["userId", "fileId"]
      }
    ]
  }
);


FileReview.belongsTo(User);

FileReview.belongsTo(File);

export default FileReview;