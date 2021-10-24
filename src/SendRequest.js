export default class SendRequest {
    request = {};
    response = {};
    static sendSignUpRequest(){
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