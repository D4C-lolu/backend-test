import { DataTypes, Model, Optional } from "sequelize";
import { dbInstance } from "../db/connectToDB";
import User from "./user.model";
import File from "./file.model";



interface FileReviewAttributes {
  id: number;
  fileId: number;
  userId: number;
}

interface FileReviewCreationAttributes extends Optional<FileReviewAttributes, "id"> {}

class FileReview extends Model<FileReviewAttributes, FileReviewCreationAttributes> implements FileReviewAttributes {
  public id!: number;
  public fileId!: number;
  public userId!: number;
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
export { FileReviewAttributes, FileReviewCreationAttributes };