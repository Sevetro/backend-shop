interface User {
  email: string;
  password?: string;
  hash: string;
  salt: string;
  fullname: string;
  phone: string;
  adress: string;
}

export const users: User[] = [
  {
    email: "maja@wp.pl",
    password: "maja",
    hash: "",
    salt: "",
    fullname: "Maja User",
    phone: "123123123",
    adress: "ul. Takasama 39 Grodziszcze",
  },
  {
    email: "julia@gmail.com",
    password: "julia",
    hash: "",
    salt: "",
    fullname: "Julia User",
    phone: "321321321",
    adress: "ul. Heheszka 21/37 Watykan",
  },
];
