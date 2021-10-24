import React, {useState} from "react";
import PropTypes from 'prop-types'
import DownloadPhoto from "./DownloadPhoto";

const featuresMaxLimit = 4;

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

function renderUserFeature(edit, features, setFeaturesValue) {
    if (edit) {
        return <div>
            <label htmlFor="inputPassword6" className="col-form-label">Features</label>
            {Array.from(Array(featuresMaxLimit).keys()).map(function (n, index) {
            return <input type="text" className="form-control list-group-item mb-3" key={"input_feature_" + index}
                        defaultValue={features[index] !== void 0 ? features[index] : ""}
                        onChange={event => setFeaturesValue(editFeatures(features, index, event.target.value))}
            />
        })}
        </div>
    }
    return features.map((feature, index) => {
        return <li className="list-group-item" key={index}>{feature}</li>
    })
}

function editFeatures(features, index, value) {
    features[index] = value;
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

function MainUser(props) {
    const [edit, setEdit] = useState(false);
    const [nameValue, setNameValue] = useState(props.user.name);
    const [featuresValue, setFeaturesValue] = useState(props.user.features);
    const [photoValue, setPhotoValue] = useState(props.user.photo);

    const activateEditMode = () => {
        setEdit(true);
    };
    const deActivateEditMode = () => {
        setEdit(false);
    };
    return (
            <div className="container-fluid p-3 bg-light border">
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
                    <div className="col-md-5 p-3 d-flex flex-column">
                        <div className="mb-3 mb-md-0 p-0">
                            { renderUserName(edit, nameValue, setNameValue) }
                        </div>
                        <div className="pt-3">
                            <ul className="list-group">
                                { renderUserFeature(edit, featuresValue, setFeaturesValue) }
                            </ul>
                        </div>
                        <div className="container-fluid p-0 pt-3 col-12">
                            <div className="row m-0">
                                <div className="col-md-4 p-0 pe-md-1 mb-3">
                                    { renderEditButton(edit, activateEditMode, deActivateEditMode)}
                                </div>
                                <div className="col-md-4 p-0 ps-md-1 mb-3">
                                    <button type="button" className="btn btn-outline-dark col-12">Search </button>
                                </div>
                                <div className="col-md-4 p-0 ps-md-1 mb-3">
                                    <button type="button" className="btn btn-outline-dark col-12">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex flex-column pt-3 border border-dark text-dark">
                        {/*<label htmlFor="searchSelect" className="col-form-label">Search:</label>*/}
                        {/*<select className="form-select">*/}
                        {/*    <option value="0" selected>Events</option>*/}
                        {/*    <option value="1">People</option>*/}
                        {/*</select>*/}
                    </div>
                </div>
            </div>
    );
}

MainUser.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        features: PropTypes.arrayOf(PropTypes.string),
        photo: PropTypes.string
    })
}

export default MainUser;