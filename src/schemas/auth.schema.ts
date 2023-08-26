import { z, TypeOf } from "zod";
import { UserRole } from "../types";

const signUpSchema = z.object({
  body: z
    .object({
      firstname: z
        .string({ required_error: "First name is required" })
        .min(2, "First name must be at least 2 characters long")
        .max(64, "First name must be at most 64 characters long"),
      lastname: z
        .string({ required_error: "First name is required" })
        .min(2, "First name must be at least 2 characters long")
        .max(64, "First name must be at most 64 characters long"),
      email: z
        .string({
          required_error: "Email is required",
        })
        .email("Not a valid email"),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password is too short - should be min 8 chars"),
      passwordConfirmation: z.string({
        required_error: "Password confirmation is required",
      }),
      role: z.nativeEnum(UserRole, {
        required_error: "Role is required",
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
});


const logInSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email is required",
        })
        .email("Not a valid email"),
      password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password is too short - should be min 8 chars")
    }),
});

export type SignUpInput = TypeOf<typeof signUpSchema>["body"];
export type LogInInput = TypeOf<typeof logInSchema>["body"];
export {logInSchema, signUpSchema };