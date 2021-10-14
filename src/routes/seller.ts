import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

const { seller } = new PrismaClient();

router.get("/", async (req, res) => {
  const sellers = await seller.findMany({
    select: {
      id: true,
      fullname: true,
      phone: true,
      email: true,
      products: true,
    },
  });

  res.json({ success: true, sellers });
});

router.post("/", async (req, res) => {
  const { email, password, fullname, phone, adress } = req.body;

  const sellerExists = await seller.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });

  if (sellerExists) {
    return res.status(400).json({
      msg: "seller already exists",
    });
  }

  // const newSeller = await seller.create({
  //   data: {
  //     email,
  //     password,
  //     fullname,
  //     phone,
  //     adress,
  //   },
  // });

  // res.json(newSeller);
});

export default router;
