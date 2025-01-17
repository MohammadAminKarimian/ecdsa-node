import { useContext } from "react";
import { UserContext } from "./UserContext";

function Info() {
    const { user } = useContext(UserContext);
    return (
        <div className="container info">
            <h1>Info</h1>
            <label >
            Private Key
            <input placeholder="" value={user.privateKey} className="private"/>
            </label>
            <label >
            Public Key
            <input placeholder="" value={user.privateKey} className="public"/>
            </label>
        </div>
    );
}

export default Info;