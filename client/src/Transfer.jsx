import { useContext, useState } from "react";
import server from "./server";
import { UserContext } from "./UserContext";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer() {
  
  const { user, setUser } = useContext(UserContext);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  function bigIntToUint8Array(bigInt) {
    const hex = bigInt.toString(16).padStart(64, "0"); // Ensure 32 bytes (64 hex characters)
    return new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  }

  // curried function
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const transactionData = {
      sender: user.address,
      amount: parseInt(sendAmount),
      recipient,
    };

    // Hash the transaction message (data)
    const serializedTransaction = JSON.stringify(transactionData);
    const transactionBytes = utf8ToBytes(serializedTransaction);
    const hash = keccak256(transactionBytes);

    // Sign transaction using the message hash.
    const signature = secp256k1.sign(hash, user.privateKey);
    const serializedSignature = {
      signature: signature.toCompactHex(),
      recovery: signature.recovery,
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, { data: transactionData, sig: serializedSignature });
      // setBalance(balance);
      setUser({...user, balance: balance});
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={ setValue(setSendAmount) }
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={ setValue(setRecipient) }
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
