import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
require("dotenv").config();
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import passport from "passport";

import user from "./src/routes/user";
import seller from "./src/routes/seller";
import product from "./src/routes/product";
import auth from "./src/routes/auth";
require("./src/config/passport");

declare module "express-session" {
  interface SessionData {
    timesVisited: number;
    passport: {
      user: any;
    };
  }
}

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  NODE_ENV = "dev",
  PORT = 3000,
  SESS_LIFETIME = TWO_HOURS,
  SESS_NAME = "defaultNameElo",
  SESS_SECRET = "defaultSecretElo",
} = process.env;

const prisma = new PrismaClient();
const prismaStore = new PrismaSessionStore(prisma, {
  checkPeriod: 1000 * 15,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const app: Application = express();

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`--------------------------`);
  console.log(`Times visited: ${req.session.timesVisited}`);
  console.log(`Session ID: ${req.session.id}`);
  console.log(`Session.user: ${req.user}`);
  console.log(`Session.passport.user: ${req.session.passport?.user}`);

  next();
};

const timesVisited = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.timesVisited) {
    req.session.timesVisited++;
  } else {
    req.session.timesVisited = 1;
  }
  next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("public")));

app.use("/user", user);
app.use("/seller", seller);
app.use("/product", product);
app.use(
  session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: prismaStore,
    cookie: {
      maxAge: Number(SESS_LIFETIME),
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(timesVisited);
app.use(logger);
app.use(auth);

app.all("*", (req, res) => res.status(404).send(`<h1>resource not found</h1>`));

//error handler

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
