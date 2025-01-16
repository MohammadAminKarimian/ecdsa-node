const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

const users = [
  {
    username: "alpha1amk",
    password: "123456",
    privateKey: "f89ds48f456sgd4564f8s",
    address: "0x1",
    balance: 100,
  },
  {
    username: "soli",
    password: "1234567",
    privateKey: "y2we94f54we5f4564ew8f",
    address: "0x2",
    balance: 75,
  },
  {
    username: "ehsan",
    password: "12345678",
    privateKey: "9f8sa4f465ew38544asfa",
    address: "0x3",
    balance: 50,
  },
];

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.send({ user: getUser(username, password) });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getUser(username, password) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username && users[i].password == password)
      return users[i];
  }
}
