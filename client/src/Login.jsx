import server from "./server";

function Login() {

  return (
    <div className="container login">
      <h1>Login</h1>

      <label>
        Username
      <input placeholder="name for your profile"></input>
      </label>
      <label>
        Password
      <input placeholder="at least six digits"></input>
      </label>
      <input className="button green-background" type="submit" value="Login" />
    </div>
  );
}

export default Login;
