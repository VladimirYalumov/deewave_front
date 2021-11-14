import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types'
import DownloadPhoto from "./DownloadPhoto";
import Cookies from "universal-cookie";
import ContentPopover from './Popover';

import DefaultImage from "../Globals/DefaultImage";
import Host from './../Globals/Host';
import Popover from "react-bootstrap/Popover";
import SearchSettings from "./SearchSettings";

const featuresMaxLimit = 4;
const featuresLengthLimit = 35;

const searchMethodTypes = {
    userByName: 1
}

function renderUserName(edit, name, setNameValue) {
    if (edit) {
        return <div className="p-3 mb-3 text-dark">
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

function renderUserFeature(edit, features, setFeaturesValue, errorFeaturesIndexes, setErrorFeaturesIndexes, isPopoverOpen, setIsPopoverOpen) {
    if (edit) {
        const popover = (
            <Popover id="popover-basic">
                <Popover.Header as="h3">What is a features?</Popover.Header>
                <Popover.Body>
                    <p>Features - it is your hobbies, interests, job and everything, what do you want!</p>
                    <p className="fw-bold">For example:</p>
                    <ul>
                        <li className="fw-bold">Play the guitar</li>
                        <li className="fw-bold">Work the developer in GOOGLE</li>
                        <li className="fw-bold">Travel the mountains</li>
                        <li className="fw-bold">VERY COOL BOY!</li>
                    </ul>
                </Popover.Body>
            </Popover>
        );
        return <div className="p-3">
            <div className={"col-form-label d-flex bd-highlight "  + (errorFeaturesIndexes.length ? "text-danger" : "text-dark")}>
                <div className="p-2 w-100 bd-highlight">Features</div>
                <div className="p-2 flex-shrink-1 bd-highlight"><ContentPopover popover={popover} /></div>
            </div>
            <ul className="list-group">
            {Array.from(Array(featuresMaxLimit).keys()).map(function (n, index) {
                return <input type="text" className={"form-control mb-3 " + (errorFeaturesIndexes.indexOf(index) != -1 ? "is-invalid" : "")} key={"input_feature_" + index}
                              defaultValue={features[index] !== void 0 ? features[index] : ""}
                              onChange={event => setFeaturesValue(editFeatures(features, index, event.target.value, setErrorFeaturesIndexes))} /> })}
            </ul>
            <span className={"form-text " + (errorFeaturesIndexes.length ? "text-danger" : "")}>Feature limit: {featuresLengthLimit} characters</span>
        </div>
    }
    return features.map((feature, index) => {
        return <li style={{"wordWrap":"break-word"}} className="list-group-item" key={index}>{feature}</li>
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
        return <label type="button" className="btn btn-outline-light col-12" onClick={() => deActivateEditMode()}>Save</label>
    }
    return <label type="button" className="btn btn-outline-light col-12" onClick={() => activateEditMode()}>Edit Profile</label>
}

function UserProfile({user, setUser, searchDataContent, searchDataType}) {
    const [edit, setEdit] = useState(false);
    const [nameValue, setNameValue] = useState(user.name);
    const [featuresValue, setFeaturesValue] = useState(user.features);
    const [photoValue, setPhotoValue] = useState(user.photo !== "" ? user.photo : DefaultImage);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorFeaturesIndexes, setErrorFeaturesIndexes] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [searchMethod, setSearchMethod] = useState(searchMethodTypes.userByName);
    const [searchValue, setSearchValue] = useState("");

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
        <div className="container-fluid bg-light p-0 pb-3 rounded">
            <div className="container-fluid p-3 pb-0 col-12" style={{backgroundColor: "#262624"}}>
                <div className="row m-0">
                    <div className="col-md-2 p-0 pe-md-1 mb-3">
                        { renderEditButton(edit, activateEditMode, deActivateEditMode)}
                    </div>
                    <div className="col-md-2 p-0 ps-md-1 mb-3">
                        <label type="button" className="btn btn-outline-light col-12">Add Event</label>
                    </div>
                    <div className="col-md-2 p-0 ps-md-1 mb-3 ms-auto">
                        <label type="button" className="btn btn-outline-danger col-12" onClick={submitSignOutRequest}>Sign Out</label>
                    </div>
                </div>
            </div>
            {renderMessage()}
            <div className="row m-0">
                <div className="col-md-3 p-3 text-center">
                        <img
                            style={{"height":"auto"}}
                            className="img-thumbnail rounded mx-auto d-block"
                            src={"data:image/png;base64," + photoValue}
                            alt="Logo"
                        />
                    { edit ? <DownloadPhoto setPhotoValue={setPhotoValue} /> : "" }
                </div>
                <div className="col-md-5 p-3">
                    <div className="mb-3 mb-md-0 p-0">
                        { renderUserName(edit, nameValue, setNameValue) }
                    </div>
                    <div className="mb-3 mb-md-0 p-0">
                        { renderUserFeature(edit, featuresValue, setFeaturesValue, errorFeaturesIndexes, setErrorFeaturesIndexes, isPopoverOpen, setIsPopoverOpen) }
                    </div>
                </div>
                <div className="col-md-4 d-flex flex-column mt-3 text-dark border-start">
                    <label htmlFor="searchSelect" className="col-form-label">Search:</label>
                    <select defaultValue={'1'} className="form-select" onChange={e => setSearchMethod(Number(e.target.value)) }>
                        <option value="0">Events</option>
                        <option value="1">People</option>
                    </select>
                    <SearchSettings searchMethod={searchMethod} searchMethodTypes={searchMethodTypes} setSearchValue={setSearchValue} />
                    <div className="col-12 mt-3">
                        <label type="button" className="btn btn-dark col-12" onClick={searchDataStart}>Search</label>
                    </div>
                </div>
            </div>
        </div>
    );

    function searchDataStart() {
        searchDataContent("");
        setTimeout(updateSearcData, 100);
    }

    function updateSearcData() {
        searchDataContent(searchValue);
        searchDataType(searchMethod);
    }

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