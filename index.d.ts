import { UserAttributes } from "./src/models/user.model"; // Update the path

declare global {
  namespace Express {
    interface User extends UserAttributes {} // Assuming UserAttributes is your user model's interface
  }
}