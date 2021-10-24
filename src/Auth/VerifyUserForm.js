import React, {useState} from "react";
import Validation from '../Validation';

const passwordLength = {min: 8, max: 16};

function VerifyUserForm({email, setErrorResponse}) {
    const [showToast, setShowToast] = useState(false);
    const [code, setCode] = useState("");

    function setCodeValue(code) {
        if (code.length > 4) {
            code = code.slice(0, -1)
        }
        setCode(code)
    }
    function closeToast() {
        setShowToast(false);
    }

    return (
        <div className="card-body">
            <p>Your account has been successfully created. A confirmation code was sent to mail <strong>{email}</strong>.</p>
            <div className="raw pe-md-5 me-md-5">
                <div className="input-group col-md-8 mb-3">
                    <input type="number" className="form-control" placeholder="Verification Code" value={code} onChange={event => setCodeValue(event.target.value)} />
                    <button className="btn btn-success" type="button" id="button-addon1" onClick={submitVerifyUserRequest}>Activate</button>
                </div>
                <button className="btn btn-sm btn-dark" type="button" onClick={submitSendVerifyCodeRequest}>Send Code Again</button>
            </div>
            <div className="position-fixed bottom-0 end-0 p-3">
                <div className={"toast fade " + (showToast ? "show" : "hide")} >
                    <div className="toast-header">
                        <strong className="me-auto">Send code</strong>
                        <button type="button" className="btn-close m-0" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        Code was send om email {email}.
                    </div>
                </div>
            </div>
        </div>
    );

    function submitVerifyUserRequest() {
        setErrorResponse("");

        let body = {
            'code': code,
            'email': email,
            'client': "deewave"
        };

        fetch('http://127.0.0.1:8080/verify_user', {
            method: 'POST',
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
                alert("ok");
            }
        })
        .catch(function (response) {
            setErrorResponse("Internal error");
        });
    }

    function submitSendVerifyCodeRequest() {
        setErrorResponse("");
        let body = {
            'email': email,
            'client': 'deewave'
        };

        fetch('http://127.0.0.1:8080/send_verify_code', {
            method: 'POST',
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
                setShowToast(true);
                setTimeout(closeToast, 5000);
            }
        })
        .catch(function (response) {
            setErrorResponse("Internal error");
        });
    }
}

export default VerifyUserForm;