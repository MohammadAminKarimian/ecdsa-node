import { useContext, useState } from "react";
import server from "./server";
import { UserContext } from "./UserContext";

function Transfer() {
  
  const { user, setUser } = useContext(UserContext);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  // curried function
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: user.address,
        amount: parseInt(sendAmount),
        recipient,
      });
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
