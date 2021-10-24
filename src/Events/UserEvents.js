import React from "react";

function UserEvents() {
    return (
        <div className="container-fluid bg-black p-3">
            <div className="row m-0">
                <div className="col-4 bg-info">
                    Picture
                </div>
                <div className="col-8 bg-warning">
                    <h3>Name</h3>
                    <div className="lh-sm">User info</div>
                </div>
            </div>
        </div>
    );
}

export default UserEvents;