import React, {useState} from "react";
import Validation from '../Validation';
import VerifyUserForm from "./VerifyUserForm";
import Cookies from 'universal-cookie';

const passwordLength = {min: 8, max: 16};

function SignInForm({setAuth}) {
    const [email, setEmail] = useState({ value: "", valid: true, msgError: ""});
    const [password, setPassword] = useState({ value: "", valid: true, msgError: ""});

    const [errorResponse, setErrorResponse] = useState("")
    const [successResponse, setSuccessResponse] = useState("")
    const [showSignInForm, setShowSignInForm] = useState(true)

    const [verifyType, setVerifyType] = useState("activation")

    const [showChangePassword, setShowChangePassword] = useState(false)

    function validateFields() {
        let valid = true;
        let empty = "";

        if (!email.valid) {
            setEmail({ value: email.value, valid: false, msgError: email.msgError});
            valid = false;
        }
        if (!password.valid) {
            setPassword({ value: password.value, valid: false, msgError: password.msgError});
            valid = false;
        }

        empty = Validation.validateLength(password.value, passwordLength.min, passwordLength.max)
        if (empty !== "" && password.valid) {
            setPassword({ value: password.value, valid: false, msgError: empty});
            valid = false;
        }

        empty = Validation.validateEmail(email.value)
        if (empty !== "" && email.valid) {
            setEmail({ value: email.value, valid: false, msgError: empty});
            valid = false;
        }

        return valid;
    }

    function renderSignInResult() {
        if (errorResponse !== "")  {
            return <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Signin failed!</strong> {errorResponse}
                <button className="btn-close" onClick={() => setErrorResponse("")}></button>
            </div>
        } else if (successResponse !== "") {
            return <div className="alert alert-info alert-dismissible fade show" role="alert">{successResponse}<button className="btn-close" onClick={() => setErrorResponse("")}></button></div>
        } else {
            return "";
        }
    }

    if (showSignInForm) {
        if (showChangePassword) {
            return (
                <div className="col-md-6 card-body">
                    {renderSignInResult()}
                    <div className="mb-3">
                        <label htmlFor="inputEmail" className="form-label">Email:</label>
                        <div>
                            <input type="text" className={"form-control " + (!email.valid ? "is-invalid" : "")} id="inputEmail" placeholder="email@example.com" onChange={event => setEmail({ value: event.target.value, valid: true, msgError: ""})} />
                            { !email.valid ? <div className="invalid-feedback">{email.msgError}</div> : ""  }
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="inputPassword" className="form-label">New Password:</label>
                        <div>
                            <input type="password" className={"form-control " + (!password.valid ? "is-invalid" : "")} id="inputPassword" onChange={event => setPassword({ value: event.target.value, valid: true, msgError: ""})} />
                            { !password.valid ?
                                <div className="invalid-feedback">{password.msgError}</div> :
                                <div className="form-text">Field must be between {passwordLength.min} and {passwordLength.max} characters.</div>
                            }
                        </div>
                    </div>
                    <button className="btn btn-dark btn-lg col-12" onClick={submitChangePasswordRequest}>Change password</button>
                </div>
            );
        }
        return (
            <div className="col-md-6 card-body">
                {renderSignInResult(errorResponse)}
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email:</label>
                    <div>
                        <input type="text" className={"form-control " + (!email.valid ? "is-invalid" : "")} id="inputEmail" placeholder="email@example.com" onChange={event => setEmail({ value: event.target.value, valid: true, msgError: ""})} />
                        { !email.valid ? <div className="invalid-feedback">{email.msgError}</div> : ""  }
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password:</label>
                    <div>
                        <input type="password" className={"form-control " + (!password.valid ? "is-invalid" : "")} id="inputPassword" onChange={event => setPassword({ value: event.target.value, valid: true, msgError: ""})} />
                        { !password.valid ?
                            <div className="invalid-feedback">{password.msgError}</div> :
                            <div className="form-text">Field must be between {passwordLength.min} and {passwordLength.max} characters.</div>
                        }
                    </div>
                </div>
                <button className="btn btn-dark btn-lg col-12" onClick={submitSignInRequest}>Sign in</button>
                <button className="btn btn-link col-12 mt-3" onClick={() => setShowChangePassword(true)}>Change password</button>
            </div>
        );
    } else {
        return (
            <div className="col-md-6 card-body">
                {renderSignInResult(errorResponse)}
                <VerifyUserForm email={email.value} setErrorResponse={setErrorResponse} sendMessage={true} verifyType={verifyType} showForm={setShowSignInForm} setSuccessResponse={setSuccessResponse} />
            </div>
        );
    }

    function submitSignInRequest() {
        setErrorResponse("");
        setSuccessResponse("");
        if (!validateFields()) {
            return;
        }

        let body = {
            'email': email.value,
            'password': password.value,
        };

        fetch('http://127.0.0.1:8080/signin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Client': "deewave",
            },
            body: JSON.stringify(body)
        })
        .then(async response => {
            const isJson = response.headers.get('content-type').includes('application/json');
            const data = isJson && await response.json();
            if (!response.ok) {
                if (data.code === null || data.message === null) {
                    setErrorResponse("Invalid request");
                }
                if (data.code === 8) {
                    setShowSignInForm(false);
                    return;
                }
                setErrorResponse(data.message);
            } else {
                let cookies = new Cookies();
                cookies.set('userId', data.user, { path: '/' });
                cookies.set('authToken', data.token, { path: '/' });
                setAuth(true);
            }
        })
        .catch(function (response) {
            setErrorResponse("Internal error");
        });
    }

    function submitChangePasswordRequest() {
        setErrorResponse("");
        setSuccessResponse("");
        if (!validateFields()) {
            return;
        }

        let body = {
            'email': email.value,
            'password': password.value,
        };

        fetch('http://127.0.0.1:8080/change_password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Client': "deewave",
            },
            body: JSON.stringify(body)
        })
        .then(async response => {
            const isJson = response.headers.get('content-type').includes('application/json');
            const data = isJson && await response.json();
            if (!response.ok) {
                if (data.code === null || data.message === null) {
                    setErrorResponse("Invalid request");
                }
                if (data.code === 8) {
                    setShowSignInForm(false);
                    return;
                }
                setErrorResponse(data.message);
            } else {
                setVerifyType("password")
                setShowSignInForm(false);
            }
        })
        .catch(function (response) {
            setErrorResponse("Internal error");
        });
        setTimeout(hidePasswordForm, 5000);
    }

    function hidePasswordForm(){
        setShowChangePassword(false)
    }
}

export default SignInForm;