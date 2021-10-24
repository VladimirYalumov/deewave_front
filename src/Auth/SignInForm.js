import React, {useState} from "react";
import Validation from '../Validation';
//import VerifyUserForm from "./VerifyUserForm";

const passwordLength = {min: 8, max: 16};

function SignUpForm() {
    const [email, setEmail] = useState({ value: "", valid: true, msgError: ""});
    const [password, setPassword] = useState({ value: "", valid: true, msgError: ""});

    const [errorResponse, setErrorResponse] = useState("")
    const [successResponse, setSuccessResponse] = useState("")

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

    function renderSignUpResult(msg) {
        if (errorResponse != "")  {
            return <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Signin failed!</strong> {msg}
                <button className="btn-close" onClick={() => setErrorResponse("")}></button>
            </div>
        }
        else if (successResponse != "") {
            return ;
        }
        else {
            return ""
        }
    }

    return (
        <div className="col-md-6 card-body">
            {renderSignUpResult(errorResponse)}
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
            <div className="mb-3">
                <label htmlFor="inputPasswordConfirm" className="form-label">Confirm Password:</label>
                <div>
                    <input type="password" className={"form-control " + (!passwordConfirm.valid ? "is-invalid" : "")} id="inputPasswordConfirm" onChange={event => setPasswordConfirm({ value: event.target.value, valid: true, msgError: ""})} />
                    { !passwordConfirm.valid ? <div className="invalid-feedback">{passwordConfirm.msgError}</div> : ""  }
                </div>
            </div>
            <button className="btn btn-dark btn-lg" onClick={submitSignUpRequest}>Sign up</button>
        </div>
    );

    function submitSignUpRequest() {
        setErrorResponse("");
        setSuccessResponse("");
        if (!validateFields()) {
            return;
        }

        let body = {
            'name': "User",
            'email': email.value,
            'password': password.value
        };

        fetch('http://127.0.0.1:8080/signup', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
            .then(async response => {
                const isJson = response.headers.get('content-type').includes('application/json');
                const data = isJson && await response.json();
                if (!response.ok) {
                    if (data.code == null || data.message == null) {
                        setErrorResponse("Invalid request");
                    }
                    setErrorResponse(data.message);
                } else {
                    setSuccessResponse(data.success);
                }
            })
            .catch(function (response) {
                setErrorResponse("Internal error");
            });
    }
}

export default SignUpForm;