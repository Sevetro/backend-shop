import { PrismaClient } from "@prisma/client";
import { products } from "./products";
import { sellers } from "./sellers";
import { users } from "./users";
import { genPassword } from "../src/utils/passwordUtils";

const prisma = new PrismaClient();

async function main() {
  for (let seller of sellers) {
    const { salt, hash } = genPassword(seller.password!);
    seller.hash = hash;
    seller.salt = salt;
    delete seller.password;

    await prisma.seller.create({
      data: seller,
    });
  }

  for (let user of users) {
    const { salt, hash } = genPassword(user.password!);
    user.hash = hash;
    user.salt = salt;
    delete user.password;

    await prisma.user.create({
      data: user,
    });
  }

  for (let product of products) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log(`Seeded succesfully!`);
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
