import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import React from "react";

function Example({popover}) {
    return <OverlayTrigger trigger="click" placement="left" overlay={popover}>
        <button type="button" className="btn-circle btn btn-sm btn-dark fw-bold text-white">?</button>
    </OverlayTrigger>
}

export default Example;