const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {
  toHex,
  hexToBytes,
  bytesToUtf8,
  utf8ToBytes,
} = require("ethereum-cryptography/utils.js");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

// const balances = {
//   "0x1": 100,
//   "0x2": 50,
//   "0x3": 75,
// };

// Lets think that server doesn't have privateKey and user maintains it's key.
const users = [
  {
    username: "alpha1amk",
    password: "123456",
    privateKey:
      "472041413d51b1b996b5cc24cd7ca5b8664cb892ebf022cbfa42a9cc66d71bb3",
    address: "63748c46abf3dc2536e75a68c848ca013713aaa6",
    balance: 100,
  },
  {
    username: "soli",
    password: "1234567",
    privateKey:
      "b802ecb68421f4921c2d1d7e73d0842985152208a593bdb6cfdf6e69df7fb852",
    address: "7f5c9383a463f0260d9e54af7de152455955916b",
    balance: 75,
  },
  {
    username: "ehsan",
    password: "12345678",
    privateKey:
      "6106a02cba0c1ade33f933fc569614ed57b2f741f44e619f29daa0bdbd9a6b48",
    address: "f9462f4398eced1845a3337e1be524094dabe7c3",
    balance: 50,
  },
];

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  let balance = 0;
  users.forEach((user) => {
    if (user.address === address) balance = user.balance;
  });
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // const { sender, recipient, amount } = req.body;

  const { data, sig } = req.body;
  const { sender, recipient, amount } = data;

  // validate the transaction request
  const isValid = validateTransaction(data, sig);

  if (isValid) {
    let sIndex, rIndex;
    for (let i = 0; i < users.length; i++) {
      if (users[i].address === sender) sIndex = i;
      if (users[i].address === recipient) rIndex = i;
    }

    if (users[sIndex].balance < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      users[sIndex].balance -= amount;
      users[rIndex].balance += amount;
      res.send({ balance: users[sIndex].balance });
    }
  } else {
    console.log("Request can't be authenticated !!!");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  res.send({ user: getUser(username, password) });
});

app.post("/devInit", (req, res) => {
  users.forEach((user) => {
    const privateKeyBytes = secp256k1.utils.randomPrivateKey();
    console.log(privateKeyBytes);
    user.privateKey = toHex(privateKeyBytes);
    user.address = generatedAddress(user.privateKey);
    console.log(`username: ${user.username}`);
    console.log(`privateKeyBytes: ${privateKeyBytes}`);
    console.log(`privateKey: ${user.privateKey}`);
    console.log(`userETH_Address: ${user.address}`);
  });

  return res.send({ users: users });
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

function generatedAddress(privateKeyHex) {
  const privateKeyBytes = hexToBytes(privateKeyHex);
  console.log(privateKeyBytes);
  const publicKey = secp256k1.getPublicKey(privateKeyBytes, false);
  const keccakHashBytes = keccak256(publicKey.slice(1));
  const ethAddress = toHex(keccakHashBytes.slice(-20));

  console.log(`publicKey: ${publicKey}`);
  console.log(`publicKey compress key: ${publicKey.slice(0, 1)}`);
  console.log(`keccak: ${keccakHashBytes}`);
  console.log(`ethAddress: ${ethAddress}`);

  return ethAddress;
}

function getAddressFromPublicKey(publicKey) {
  const keccakHashBytes = keccak256(publicKey.slice(1));
  const ethAddress = toHex(keccakHashBytes.slice(-20));
  // console.log(`ethAddress: ${ethAddress}`);

  return ethAddress;
}

// Example Implementaion of Utils.hexToBytes
function hexToUint8Array(hexString) {
  const bytes = [];
  for (let c = 0; c < hexString.length; c += 2) {
    bytes.push(parseInt(hexString.substr(c, 2), 16));
  }
  return new Uint8Array(bytes);
}

function validateTransaction(data, sig) {
  const { signature, recovery } = sig;
  const compactSignature = hexToBytes(signature);

  const serializedTransaction = JSON.stringify(data);
  const transactionBytes = utf8ToBytes(serializedTransaction);
  const hashedData = keccak256(transactionBytes);

  const sigInstance = secp256k1.Signature.fromCompact(compactSignature);
  sigInstance.recovery = recovery;
  const publicKey = sigInstance.recoverPublicKey(hashedData).toRawBytes(false);
  console.log(publicKey);

  console.log("compare addresses ...");
  console.log(`...user.address: ${data.sender}`);
  console.log(`decoded.address: ${getAddressFromPublicKey(publicKey)}`);
  if (data.sender === getAddressFromPublicKey(publicKey)) return true;
  else return false;
}
