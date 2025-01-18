import { useContext, useState } from "react";
import server from "./server";
import { UserContext } from "./UserContext";

function Wallet({address, setAddress, balance, setBalance}) {

  const { user, setUser } = useContext(UserContext);
  const [ isChanged, setIsChanged ] = useState(false);

  async function onChange(evt) {
    setIsChanged(true);
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }

    // setUser({...user});
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" 
        value={isChanged ? address : user.address} onChange={onChange} className="address"></input>
      </label>

      <div className="balance">Balance: {isChanged ? balance : user.balance}</div>
    </div>
  );
}

export default Wallet;
