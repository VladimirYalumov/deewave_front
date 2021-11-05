import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import mainLogoImg from "./header.svg"
import MainUser from "./UserInfo/MainUser";
import React, { useState } from "react"
import Auth from "./Auth/Auth";
require('bootstrap');

function App() {
    const [auth, setAuth] = useState(true);
    return (
        <div className="container main text-white mt-3">
            <div className="col-12 mb-3">
                <img
                    width="100%"
                    src={mainLogoImg}
                    alt="Logo"
                />
            </div>
            {!auth ? <Auth setAuth={setAuth} /> : <MainUser setAuth={setAuth} />}
        </div>
    );
}

export default App;
