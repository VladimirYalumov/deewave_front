import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import React from "react";

function Example({popover}) {
    return <OverlayTrigger trigger="click" placement="left" overlay={popover}>
        <label type="button" className="btn-circle btn btn-sm btn-outline-dark fw-bold">?</label>
    </OverlayTrigger>
}

export default Example;