function Info() {
    return (
        <div className="container info">
            <h1>Info</h1>
            <label >
            Private Key
            <input placeholder="" className="private"/>
            </label>
            <label >
            Public Key
            <input placeholder="" className="public"/>
            </label>
        </div>
    );
}

export default Info;