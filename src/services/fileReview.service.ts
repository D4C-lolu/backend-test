import FileReview,  { FileReviewCreationAttributes } from "../models/fileReview.model";

class FileReviewService {
  static async createFileReview(reviewData: FileReviewCreationAttributes): Promise<FileReview> {
    try {
      const createdReview = await FileReview.create(reviewData);
      return createdReview;
    } catch (error) {
      throw new Error(`Error creating file review: ${error}`);
    }
  }

  static async getFileReviewById(id: number): Promise<FileReview | null> {
    try {
      const review = await FileReview.findByPk(id);
      return review;
    } catch (error) {
      throw new Error(`Error fetching file review by ID: ${error}`);
    }
  }

  static async deleteFileReview(id: number): Promise<void> {
    try {
      await FileReview.destroy({ where: { id } });
    } catch (error) {
      throw new Error(`Error deleting file review: ${error}`);
    }
  }

  static async checkIfOwner(userId:number, reviewId: number):Promise<boolean> {
    try {
      const review = await FileReview.findByPk(reviewId);
      if (review) {
        return review.userId === userId;
      }
      return false;
    } catch (error) {
      throw new Error(`Error checking if owner: ${error}`);
    }
  }
  
}

export default FileReviewService;
