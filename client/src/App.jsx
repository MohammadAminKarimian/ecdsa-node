import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Login from "./Login";
import Info from "./Info";
import "./App.scss";
import { useState } from "react";
import { UserProvider } from "./UserContext";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    // <UserProvider>
      <div className="app">
      <div className="horizontal-container">
      <UserProvider>
      <Login />
      </UserProvider>
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />
      </div>
      <Info />
    </div>
    // </UserProvider>
  );
}

export default App;
