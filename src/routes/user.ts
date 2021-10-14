import express from "express";
import { PrismaClient } from "@prisma/client";

// post userController = require userInfo..

const router = express.Router();

const { user } = new PrismaClient();

router.get("/", async (req, res) => {
  const users = await user.findMany({
    select: {
      fullname: true,
      phone: true,
      email: true,
    },
  });

  res.status(200).json({ success: true, users });
});

// router.route('/').get(userController.getAllUsers).post(userController.createUser)

// router.route('/:id').get(userController.getUser)

// module.exports = router;
export default router;
