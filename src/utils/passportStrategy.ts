import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../models";

passport.use(new LocalStrategy(
  async ( email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return done(null, false, { message: "Invalid credentials" });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Invalid credentials" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: {
  id?: number
}, done) => {
  done(null, user.id);
});

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