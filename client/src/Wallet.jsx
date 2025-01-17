import { useContext } from "react";
import server from "./server";
import { UserContext } from "./UserContext";

function Wallet() {

  const { user, setUser } = useContext(UserContext);

  async function onChange(evt) {
    // const address = evt.target.value;
    // setUser({...user, address: address});
    // if (address) {
    //   const {
    //     data: { balance },
    //   } = await server.get(`balance/${address}`);
    //   setUser({...user, balance: balance});
    // } else {
    //   setUser({...user, balance: 0});
    // }

    setUser({...user});
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={user.address} onChange={onChange} className="address"></input>
      </label>

      <div className="balance">Balance: {user.balance}</div>
    </div>
  );
}

export default Wallet;
