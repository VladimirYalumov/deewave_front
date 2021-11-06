import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types'
import DownloadPhoto from "./DownloadPhoto";
import Cookies from "universal-cookie";

import DefaultImage from "../Globals/DefaultImage";
import Host from './../Globals/Host';

const featuresMaxLimit = 4;
const featuresLengthLimit = 35;

function renderUserName(edit, name, setNameValue) {
    if (edit) {
        return <div className="pt-3 row mb-3 text-dark">
            <div className="col-auto">
                <label htmlFor="inputPassword6" className="col-form-label">Name</label>
            </div>
            <div className="col-auto">
                <input type="text" className="form-control" id="editName" defaultValue={name} onChange={event => setNameValue(event.target.value)} />
            </div>
        </div>
    }
    return <h3 className="text-center text-md-start m-0 text-dark">{name}</h3>
}

function renderUserFeature(edit, features, setFeaturesValue, errorFeaturesIndexes, setErrorFeaturesIndexes) {
    if (edit) {
        return <div>
            <div className={"col-form-label "  + (errorFeaturesIndexes.length ? "text-danger" : "text-dark")}>Features</div>
            {Array.from(Array(featuresMaxLimit).keys()).map(function (n, index) {
                return <input type="text" className={"form-control mb-3 " + (errorFeaturesIndexes.indexOf(index) != -1 ? "is-invalid" : "")} key={"input_feature_" + index}
                              defaultValue={features[index] !== void 0 ? features[index] : ""}
                              onChange={event => setFeaturesValue(editFeatures(features, index, event.target.value, setErrorFeaturesIndexes))} /> })}
            <span className={"form-text " + (errorFeaturesIndexes.length ? "invalid-feedback" : "")}>Feature limit: {featuresLengthLimit} characters</span>
        </div>
    }
    return features.map((feature, index) => {
        return <li className="list-group-item" key={index}>{feature}</li>
    })
}

function editFeatures(features, index, value, setErrorFeaturesIndexes) {
    setErrorFeaturesIndexes([]);
    features[index] = value;
    if (value.length > featuresLengthLimit) {
        let errorIndexes = [];
        errorIndexes.push(index);
        setErrorFeaturesIndexes(errorIndexes)
    }
    if (value === "") {
        features.splice(index, 1);
    }
    return features;
}

function renderEditButton(edit, activateEditMode, deActivateEditMode) {
    if (edit) {
        return <button type="button" className="btn btn-success col-12" onClick={() => deActivateEditMode()}>Save</button>
    }
    return <button type="button" className="btn btn-outline-dark col-12" onClick={() => activateEditMode()}>Edit</button>
}

function UserProfile({user, setUser}) {
    const [edit, setEdit] = useState(false);
    const [nameValue, setNameValue] = useState(user.name);
    const [featuresValue, setFeaturesValue] = useState(user.features);
    const [photoValue, setPhotoValue] = useState(user.photo !== "" ? user.photo : DefaultImage);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorFeaturesIndexes, setErrorFeaturesIndexes] = useState([]);
    function renderMessage() {
        if (errorMessage !== "") {
            return <div className="alert alert-danger alert-dismissible fade show col-12" role="alert">
                <div>{errorMessage}</div>
                <button className="btn-close" onClick={() => setErrorMessage("")}></button>
            </div>
        }
    }

    const savedUser = user;

    const activateEditMode = () => {
        setEdit(true);
    };
    const deActivateEditMode = () => {

        if (!submitUpdateUser()) {
            return;
        }
        setEdit(false);
    };
    return (
        <div className="container-fluid p-3 bg-light border">
            {renderMessage("pizdec", "")}
            <div className="row m-0">
                <div className="col-md-3 p-3">
                        <img
                            style={{"height":"auto"}}
                            className="img-thumbnail rounded"
                            src={"data:image/png;base64," + photoValue}
                            alt="Logo"
                        />
                    { edit ? <DownloadPhoto setPhotoValue={setPhotoValue} /> : "" }
                </div>
                <div className="col-md-5 p-3">
                    <div className="mb-3 mb-md-0 p-0">
                        { renderUserName(edit, nameValue, setNameValue) }
                    </div>
                    <div className="">
                        <ul className="list-group">
                            { renderUserFeature(edit, featuresValue, setFeaturesValue, errorFeaturesIndexes, setErrorFeaturesIndexes) }
                        </ul>
                    </div>
                    <div className="container-fluid p-0 pt-3 col-12">
                        <div className="row m-0">
                            <div className="col-md-4 p-0 pe-md-1">
                                { renderEditButton(edit, activateEditMode, deActivateEditMode)}
                            </div>
                            <div className="col-md-4 p-0 ps-md-1">
                                <button type="button" className="btn btn-outline-dark col-12">Add</button>
                            </div>
                            <div className="col-md-4 p-0 ps-md-1">
                                <button type="button" className="btn btn-outline-danger col-12" onClick={submitSignOutRequest}>Sign Out</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex flex-column pt-3 text-dark">
                    <label htmlFor="searchSelect" className="col-form-label">Search:</label>
                    <select defaultValue={'0'} className="form-select">
                        <option value="0">Events</option>
                        <option value="1">People</option>
                    </select>
                    <div className="col-12 mt-3">
                        <button type="button" className="btn btn-dark col-12">Search </button>
                    </div>
                </div>
            </div>
        </div>
    );

    function submitSignOutRequest() {
        const cookies = new Cookies();
        if (typeof cookies.get('userId') === 'undefined' || typeof cookies.get('authToken') === 'undefined') {
            window.location.reload();
        }

        let body = {
            'user_id': +cookies.get('userId'),
        };

        fetch(Host + '/signout', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': cookies.get('authToken'),
                'Client': "deewave",
            },
            body: JSON.stringify(body)
        })
        .then(async response => {
            const isJson = response.headers.get('content-type').includes('application/json');
            const data = isJson && await response.json();
            if (!response.ok) {
                window.location.reload();
            } else {
                window.location.reload();
            }
        })
        .catch(function (response) {
            window.location.reload();
        });
    }

    function submitUpdateUser() {
        const cookies = new Cookies();
        if (typeof cookies.get('userId') === 'undefined' || typeof cookies.get('authToken') === 'undefined') {
            window.location.reload();
            return false;
        }
        if (!validateFeatures()) {
            setFeaturesValue(featuresValue);
            return false;
        }
        let localName = "";
        let localPhoto = "";

        if (nameValue !== savedUser.name) {
            localName = nameValue;
        }
        if (!nameValue.length) {
            localName = savedUser.name;
        }

        if (photoValue !== savedUser.photo) {
            localPhoto = photoValue;
        }
        let body = {
            'user_id': +cookies.get('userId'),
            'name': localName,
            'features': featuresValue,
            'image': localPhoto
        };

        fetch(Host + '/user', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': cookies.get('authToken'),
                'Client': "deewave",
            },
            body: JSON.stringify(body)
        })
        .then(async response => {
            const isJson = response.headers.get('content-type').includes('application/json');
            const data = isJson && await response.json();
            if (!response.ok) {
                if (data.code == null || data.message == null) {
                    setErrorMessage("Invalid request");
                }
                setErrorMessage(data.message);
            } else {
                let message = "";
                let newUser = {
                    name: nameValue,
                    features: featuresValue,
                    photo: photoValue
                };
                if (data.features === false) {
                    newUser.features = savedUser.features;
                    setFeaturesValue(savedUser.features);
                    message += "Field Features is invalid. ";
                }
                if (data.name === false) {
                    newUser.name = savedUser.name;
                    setNameValue(savedUser.name);
                    message += "Name is taken by another user. ";
                }
                setErrorMessage(message);
                setUser(newUser)
            }
        })
        .catch(function (response) {
            setErrorMessage("Internal error");
        });
        return true;
    }

    function validateFeatures(){
        let errorIndexes = [];
        setErrorFeaturesIndexes([]);
        featuresValue.map((feature, index) => {
            if (feature.length > featuresLengthLimit) {
                errorIndexes.push(index);
            }
        })

        if (!errorIndexes.length) {
            setErrorFeaturesIndexes([]);
            return true;
        }
        setErrorFeaturesIndexes(errorIndexes);
        return false;
    }
}

UserProfile.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        features: PropTypes.arrayOf(PropTypes.string),
        photo: PropTypes.string
    })
}

export default UserProfile;