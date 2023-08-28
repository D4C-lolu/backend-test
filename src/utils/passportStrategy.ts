import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../models";
import logger from "./logger";

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        logger.info("Did not find user");
        return done(null, false, { message: "Invalid credentials" });
      }
     
      logger.info("User is: ", user);
      return done(null, user); // Authentication succeeded
    } catch (error) {
      return done(error);
    }
  })
);
// passport.use(
//   new LocalStrategy(async (email, password, done) => {
//     try {
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//         return done(null, false, { message: "Invalid credentials" });
//       }

//       if (!bcrypt.compareSync(password, user.password)) {
//         return done(null, false, { message: "Invalid credentials" });
//       }

//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   })
// );

passport.serializeUser(
  (
    user: {
      id?: number;
    },
    done
  ) => {
    done(null, user.id);
  }
);

passport.deserializeUser(async (id: string | number, done) => {
  try {
    const userId = typeof id === "string" ? parseInt(id, 10) : id;
    const user = await User.findByPk(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
