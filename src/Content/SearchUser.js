import React, {useEffect, useState} from "react";
import Cookies from "universal-cookie";
import Host from "../Globals/Host";
import DownloadPhoto from "../MainUserContent/DownloadPhoto";

import DefaultImage from "../Globals/DefaultImage";

function SearchUser({searchDataContent}) {
    const [endSearch, setEndSearch] = useState(false);
    const [user, setUser] = useState({name: "", features: [], photo: ""});
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const cookies = new Cookies();
        if (typeof cookies.get('userId') !== 'undefined' || typeof cookies.get('authToken') !== 'undefined') {
        }
        fetch(Host + '/users/' + cookies.get('userId') + '?type=1&value=' + searchDataContent, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': cookies.get('authToken'),
                'Client': "deewave",
            },
        })
        .then(async response => {
            const data = JSON.parse(await response.text());
            if (!response.ok) {
                if (data.code == null || data.message == null) {
                    setEndSearch(true);
                    setErrorMessage("Invalid request");
                    return;
                }
                setEndSearch(true);
                setErrorMessage(data.message);
                return;
            }
            return data;
        })
        .then(async data => {
            if (typeof data === 'undefined') {
                return;
            }
            setUser({
                name: data.users[0]['name'],
                features: data.users[0]['features'],
                photo: data.users[0]['image'] !== "" ? data.users[0]['image'] : DefaultImage
            });
            setEndSearch(true);
        })
        .catch(function (response) {
            setErrorMessage("Internal error");
            setEndSearch(true);
        });
    }, [])

    if (user.name === "" && endSearch) {
        return <div className="alert alert-danger alert-dismissible fade show col-12 mt-5" role="alert">
            <div>{errorMessage}</div>
        </div>
    } else if (user.name === "" && !endSearch) {
        return endSearch;
    } else {
        return <div className="container-fluid p-0 pb-3 mt-5 bg-light border text-dark">
            <div className="row m-0">
                <div className="col-md-3 p-3 text-center">
                    <img
                        style={{"height":"auto"}}
                        className="img-thumbnail rounded mx-auto d-block"
                        src={"data:image/png;base64," + user.photo}
                        alt="Logo"
                    />
                </div>
                <div className="col-md-5 p-3">
                    <div className="mb-3 mb-md-0 p-0">
                        <h3 className="text-center text-md-start m-0 text-dark">{user.name}</h3>
                    </div>
                    <div className="mb-3 mb-md-0 p-0">
                        {
                            user.features.map((feature, index) => {
                                return <li style={{"wordWrap":"break-word"}} className="list-group-item" key={index}>{feature}</li>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    }
}

export default SearchUser;