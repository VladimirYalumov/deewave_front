import React, {useEffect} from "react";

function SearchSettings({searchMethod, searchMethodTypes, setSearchValue}) {
    if (searchMethod === searchMethodTypes.userByName) {
        return <div className="row align-items-center pt-3">
            <div className="col-12">
                <label htmlFor="searchByNameField" className="col-form-label">Name</label>
            </div>
            <div className="col-12">
                <input type="text" id="searchByNameField" className="form-control" onChange={event => setSearchValue(event.target.value)} />
            </div>
        </div>
    } else {
        return "";
    }
}

export default SearchSettings;