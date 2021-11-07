import React, {useState} from "react";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";

const verifyAuth = "activation"

function Auth({setAuth}) {
    const [authType, setAuthType] = useState(false);

    return (
        <div className="card text-dark">
            <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <button className={"nav-link link-dark " + (authType ? "active" : "")} aria-current="true" href="" onClick={() => setAuthType(true)}>Sign up</button>
                    </li>
                    <li className="nav-item">
                        <button className={"nav-link link-dark " + (!authType ? "active" : "")} aria-current="true" href="" onClick={() => setAuthType(false)}>Sign in</button>
                    </li>
                </ul>
            </div>
            <div className="row p-3">
                {authType ? <SignUpForm setAuth={setAuth} setAuthType={setAuthType} /> : <SignInForm setAuth={setAuth} setAuthType={setAuthType} />}
                <div className="col-md-6 p-3">
                    <h3 className="card-title mb-3">DeeWave? What is it?</h3>
                    <p>DeeWave - this is a service where you can record past or upcoming events from your fascinating life.</p>
                    <p>With DeeWave you can:</p>
                    <ul>
                        <li>Keep a diary of the highlights of your life!</li>
                        <li>Save the coolest places you've visited!</li>
                        <li>Share with your friends how and where you want to spend your time!</li>
                        <li>Find out new places that someone has visited before you!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Auth;