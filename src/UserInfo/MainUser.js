import React, {useEffect, useState} from "react";
import UserProfile from "../MainUserContent/UserProfile";
import Cookies from "universal-cookie";
import PropTypes from "prop-types";

import Host from './../Globals/Host';

function MainUser({setAuth}) {
    const [user, setUser] = useState(
        {
            name: "",
            features: [],
            photo: ""
        }
    );
    var isGetUser = false;
    useEffect(() => {
        const cookies = new Cookies();
        if (typeof cookies.get('userId') !== 'undefined' || typeof cookies.get('authToken') !== 'undefined') {
        }

        fetch(Host + '/user/' + cookies.get('userId'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': cookies.get('authToken'),
                'Client': "deewave",
            },
        })
        .then(async response => {
            const isJson = response.headers.get('content-type').includes('application/json');
            const data = isJson && await response.json();
            if (!response.ok) {
                if (data.code == null || data.message == null) {
                    setAuth(false)
                    return
                }
                setAuth(false);
                isGetUser = true;
            } else {
                setUser({
                    name: data.name,
                    features: data.features,
                    photo: data.image
                });
                setAuth(true);
                isGetUser = true;
            }
        })
        .catch(function (response) {
            isGetUser = true;
            setAuth(false)
        });
    }, [])

    if (user.name !== "") {
        return (
            <UserProfile user={user} setUser={setUser} />
        );
    } else {
        if (isGetUser) {
            setAuth(false);
        }
        return ""
    }
}

MainUser.propTypes = {
    setAuth: PropTypes.func,
}

export default MainUser;