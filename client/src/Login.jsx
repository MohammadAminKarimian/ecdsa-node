import server from "./server";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

function Login() {

  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function signIn(evt) {
    evt.preventDefault();

    const { data: { user: fetchedUser} } = await server.post("login", 
      {
        username: username,
        password: password
      }
    );
    setUser(fetchedUser);
  }

  function logUser() {
    console.log(`user.username: ${user.username}`);
    console.log(`user.password: ${user.password}`);
    console.log(`user.privateKey: ${user.privateKey}`);
    console.log(`user.address: ${user.address}`);
    console.log(`user.balance: ${user.balance}`);
  }

  async function devInit() {
    const response = await server.post("devInit");
    const users = response.data.users;

    if (users != undefined) {
      users.forEach(user => {
        console.log(user.username);
        console.log(user.privateKey);
        console.log(user.address);
      });
    }
  }

  useEffect(() => {
    window.logUserInfo = logUser;
    window.devInitInfo = devInit;
  }, [user]);

  return (
    <form className="container login" onSubmit={signIn} >
      <h1>Login</h1>
      <label>
        Username
      <input name="username" placeholder="name for your profile" onChange={setValue(setUsername)}></input>
      </label>
      <label>
        Password
      <input name="password" placeholder="at least six digits" onChange={setValue(setPassword)}></input>
      </label>
      <input className="button green-background" type="submit" value="Login" />
    </form>
  );
}

export default Login;
