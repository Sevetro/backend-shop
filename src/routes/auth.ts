import express from "express";
import passport from "passport";
import { PrismaClient } from ".prisma/client";
import path from "path";

import { genPassword } from "../utils/passwordUtils";

const router = express.Router();

const { user, seller } = new PrismaClient();

const loginRedirect = {
  successRedirect: "/login-success",
  failureRedirect: "./login-failure",
};

router.post("/register", async (req, res, next) => {
  const { salt, hash } = genPassword(req.body.password);
  const { email, fullname, adress, phone, isSeller } = req.body;

  try {
    if (isSeller) {
      await seller.create({
        data: {
          email,
          hash,
          salt,
          fullname,
          adress,
          phone,
        },
      });
    } else {
      await user.create({
        data: {
          email,
          hash,
          salt,
          fullname,
          adress,
          phone,
        },
      });
    }
  } catch (e) {
    return res.send(e);
  }

  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.sendFile(path.resolve("./src/utils/loginForm.html"));
});

router.post("/login", passport.authenticate("local", loginRedirect));

router.get("/login-success", (req, res) => {
  console.log(`--------------------------`);
  console.log(
    `/login-success MSG - req.isAuthenticated: ${req.isAuthenticated()}`
  );
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res) => {
  res.send("Wrong credentials. <a href='/login'>Go to login page</a>");
});

router.get("/protected-route", (req, res, next) => {
  console.log(`--------------------------`);
  console.log(
    `/protected-route MSG - req.isAuthenticated: ${req.isAuthenticated()}`
  );
  if (req.isAuthenticated()) {
    res.send(
      '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
    );
  } else {
    res.send(
      '<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>'
    );
  }
});

router.get("/logout", (req, res, next) => {
  // req.logout();
  // res.redirect("/protected-route");

  // req.session.destroy(() => res.redirect("/protected-route"));

  req.logOut();
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    return res.send(`<h1>You have been log out</h1>
    <a href='/login'>Go to login</a>`);
  });
});

export default router;
