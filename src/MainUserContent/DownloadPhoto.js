import React, { useState } from "react";
import Cropper from "react-cropper";
import './CustomModal.css'
import "cropperjs/dist/cropper.css";

function DownloadPhoto({setPhotoValue}){
    const [image, setImage] = useState('');
    const [cropper, setCropper] = useState();
    const [show, setShow] = useState(false);
    const [fileName, setFileName] = useState("")

    function closeModal(){
        if (typeof cropper !== "undefined" && cropper.getCroppedCanvas() !== null) {
            if (fileName === "") {
                return;
            }
            let newValue = cropper.getCroppedCanvas().toDataURL().split('base64,')[1];
            setPhotoValue(newValue);
        }
        setShow(false);
    }

    const openModal = () => {
        setShow(true);
    }

    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
        setFileName(files[0].name)
        setShow(true);
    };

    return (
        <div className="row mt-3">
            <label htmlFor="downloadPhoto" className="btn btn-outline-dark col-12">Download Photo</label>
            <input id="downloadPhoto" type="file" className="visually-hidden" onChange={onChange} />
            <button type="button" className="btn btn-outline-dark col-12 mt-1" onClick={openModal}>Edit Photo</button>
                <div className='modal custom-modal' style={show ? {display: 'block'} : {display: 'none'}}>
                    <div className="modal-dialog text-dark">
                        <div className='modal-content'>
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Photo</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>

                                { fileName !== "" ?
                                <div className="modal-body custom-modal-body">
                                    <Cropper
                                        style={{ width: "100%"}}
                                        className="img-thumbnail rounded"
                                        zoomTo={0}
                                        aspectRatio={1}
                                        src={image}
                                        background={false}
                                        viewMode={3}
                                        autoCropArea={1}
                                        minCropBoxHeight={20}
                                        minCropBoxWidth={30}
                                        onInitialized={(instance) => {
                                            setCropper(instance);
                                        }}
                                    />
                                </div> :
                                <div className="modal-body custom-modal-body">
                                    <p>Please, download your photo</p>
                                </div>
                                }
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark" onClick={closeModal}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default DownloadPhoto;