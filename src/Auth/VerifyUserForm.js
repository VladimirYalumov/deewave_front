import React, {useState, useEffect} from "react";
import Host from './../Globals/Host';

function renderDescription(type, email) {
    if (type === "activation") return <p>Your account has been successfully created, but it is not active. A confirmation code was sent to mail <strong>{email}</strong>.</p>;
    if (type === "password") return <p>To change password you must confirm you email <strong>{email}</strong>.</p>
}

function VerifyUserForm({email, setErrorResponse, sendMessage, verifyType, showForm, setSuccessResponse, setAuthType}) {
    const [showToast, setShowToast] = useState(false);
    const [code, setCode] = useState("");
    const submitSendVerifyCodeRequest = () => {
        setErrorResponse("");
        let body = {
            'email': email,
        };

        return fetch(Host + '/send_verify_code', {
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

    function setCodeValue(code) {
        if (code.length > 4) {
            code = code.slice(0, -1)
        }
        setCode(code)
    }
    function closeToast() {
        setShowToast(false);
    }

    useEffect(() => {
        if (sendMessage && verifyType !== "password") {
          submitSendVerifyCodeRequest();
        }
    }, [])

    return (
        <div className="card-body">
            {renderDescription(verifyType, email)}
            <div className="raw pe-md-5 me-md-5">
                <div className="input-group col-md-8 mb-3">
                    <input type="number" className="form-control" placeholder="Verification Code" value={code} onChange={event => setCodeValue(event.target.value)} />
                    <button className="btn btn-success" type="button" id="button-addon1" onClick={submitVerifyUserRequest}>Activate</button>
                </div>
                {verifyType !== "password" ? <button className="btn btn-sm btn-dark" type="button" onClick={submitSendVerifyCodeRequest}>Send Code Again</button> : "" }
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
            'type': verifyType
        };

        fetch(Host + '/verify_user', {
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
                if (data.code == null || data.message == null) {
                    setErrorResponse("Invalid request");
                }
                setErrorResponse(data.message);
            } else {
                if (verifyType === "activation") {
                    setSuccessResponse("Email was successfully verified");
                    localStorage.setItem('signInEmail', email);
                    setAuthType(false);
                }
                if (verifyType === "password") {
                    setSuccessResponse("Password was successfully changed");
                }
                showForm(true);
            }
        })
        .catch(function (response) {
            console.log(response)
            setErrorResponse("Internal error");
        });
    }
}

export default VerifyUserForm;