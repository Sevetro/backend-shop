interface Seller {
  email: string;
  password?: string;
  hash: string;
  salt: string;
  fullname: string;
  phone: string;
  adress: string;
}

export const sellers: Seller[] = [
  {
    email: "karol@wp.pl",
    password: "karol",
    hash: "",
    salt: "",
    fullname: "Karol Seller",
    phone: "111222333",
    adress: "ul. Nieznana 23/3 Wrocław",
  },
  {
    email: "zbyszek@gmail.com",
    password: "zbyszek",
    hash: "",
    salt: "",
    fullname: "Zbyszek Seller",
    phone: "444555666",
    adress: "ul. Krajowa 24/7 Kłodzko",
  },
];
