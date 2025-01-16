import React, { createContext, useState } from "react";

// User Template
const guest = {
  username: "guest",
  password: "",
  privateKey: "",
  address: "",
  balance: 0,
};

// Create the context
export const UserContext = createContext();

// Create a provider component to hold the state.
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(guest);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
