import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const { seller, product } = new PrismaClient();

router.get("/", async (req, res) => {
  const products = await product.findMany();

  return res.json(products);
});

router.get("/:seller_id", async (req, res) => {
  const { seller_id } = req.params;

  const products = await product.findMany({
    where: {
      seller_id: Number(seller_id),
    },
  });

  return res.json(products);
});

router.post("/", async (req, res) => {
  const { name, description, price, amount, seller_id } = req.body;

  const sellerExists = await seller.findUnique({
    where: {
      email: seller_id,
    },
  });

  if (!sellerExists) {
    return res.status(400).json({
      msg: "seller not found",
    });
  }

  const newProduct = await product.create({
    data: {
      name,
      description,
      price,
      amount,
      seller_id,
    },
  });

  res.json(newProduct);
});

export default router;
