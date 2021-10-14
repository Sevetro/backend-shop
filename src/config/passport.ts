import passport from "passport";
import LocalStrategy from "passport-local";
import { PrismaClient } from "@prisma/client";
import { validatePassword } from "../utils/passwordUtils";

const prisma = new PrismaClient();
const { user } = prisma;

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = (email: string, password: string, cb: any) => {
  user
    .findUnique({ where: { email } })
    .then((user) => {
      if (!user) cb(null, false);
      else {
        const isValid = validatePassword(password, user.hash, user.salt);

        if (isValid) return cb(null, user);
        else return cb(null, false);
      }
    })
    .catch((err) => {
      cb(err);
    });
};

const verifyCallback2 = async (email: string, password: string, cb: any) => {
  const userToVerify = await user.findUnique({ where: { email } });
  if (!userToVerify) {
    cb(null, false);
  } else {
    const isValid = validatePassword(
      password,
      userToVerify.hash,
      userToVerify.salt
    );

    if (isValid) cb(null, user);
    else cb(null, false);
  }
};

const strategy = new LocalStrategy.Strategy(customFields, verifyCallback);

passport.use(strategy);

declare global {
  namespace Express {
    export interface User {
      id: number;
    }
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
  user
    .findUnique({
      where: {
        id,
      },
    })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
