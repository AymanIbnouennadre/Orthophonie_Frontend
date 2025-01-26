import React, { useState } from 'react';

const Fonctionnalites = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleStartClick = () => {
        if (selectedFile) {
            // Handle the file upload or processing here
            console.log('File selected:', selectedFile.name);
        } else {
            console.log('No file selected');
        }
    };

    return (
        <div className="container-xxl bg-white p-0">
            <div className="container py-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: 600 }}>
                    <h1 className="mb-3">Upload Your File</h1>
                    <p>Select a file and click the start button to proceed.</p>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="mb-3">
                            <input type="file" className="form-control" onChange={handleFileChange} />
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary" onClick={handleStartClick}>Start</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fonctionnalites;