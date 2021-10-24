import React, {useState} from "react";
import SignUpForm from "./SignUpForm";

function Auth() {
    const [authType, setAuthType] = useState(1);

    return (
        <div className="card text-dark">
            <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item">
                        <a className="nav-link link-dark active" aria-current="true" href="#">Sign up</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link link-dark" aria-current="true" href="#">Sign in</a>
                    </li>
                </ul>
            </div>
            <div className="row p-3">
                {authType === 1 ? <SignUpForm /> : ""}
                <div className="col-md-6 p-3">
                    <h3 className="card-title mb-3">DeeWave? What is it, fucking niga?</h3>
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