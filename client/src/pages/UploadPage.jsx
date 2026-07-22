import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    FaCloudUploadAlt,
    FaFileCsv,
    FaCheckCircle
} from "react-icons/fa";

import "../styles/upload.css";

function UploadPage() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // ==========================
    // Validate File
    // ==========================

    const validateFile = (selectedFile) => {

        if (!selectedFile) return false;

        const allowedTypes = [
            "text/csv",
            "application/vnd.ms-excel"
        ];

        if (!allowedTypes.includes(selectedFile.type)) {

            setMessage("Only CSV files are allowed.");
            setFile(null);
            return false;

        }

        if (selectedFile.size > 10 * 1024 * 1024) {

            setMessage("File size must be less than 10 MB.");
            setFile(null);
            return false;

        }

        setMessage("");
        setFile(selectedFile);

        return true;

    };

    // ==========================
    // Upload File
    // ==========================

    const handleUpload = async () => {

        if (!file) {

            setMessage("Please select a CSV file.");
            return;

        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            setUploading(true);

            const response = await axios.post(
                "http://127.0.0.1:5000/upload",
                formData
            );

            setMessage(response.data.message);

            setTimeout(() => {

                navigate("/dashboard");

            }, 1200);

        }

        catch (error) {

            console.error(error);

            setMessage("Upload failed.");

        }

        finally {

            setUploading(false);

        }

    };

    // ==========================
    // Drag & Drop
    // ==========================

    const handleDrop = (e) => {

        e.preventDefault();

        setDragActive(false);

        validateFile(e.dataTransfer.files[0]);

    };

    const handleDragOver = (e) => {

        e.preventDefault();

        setDragActive(true);

    };

    const handleDragLeave = () => {

        setDragActive(false);

    };

    // ==========================
    // UI
    // ==========================

    return (

        <div className="upload-container">

            <div className="upload-card">

                <div className="upload-icon">

                    <FaCloudUploadAlt />

                </div>

                <h2>Upload Customer Dataset</h2>

                <p>

                    Upload your CSV dataset to generate analytics,
                    predictions and AI insights.

                </p>

                <label
                    className={dragActive ? "upload-box active" : "upload-box"}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >

                    <FaFileCsv className="csv-icon" />

                    {

                        file

                            ?

                            file.name

                            :

                            "Drag & Drop CSV file here"

                    }

                    <span>

                        or click to browse

                    </span>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => validateFile(e.target.files[0])}
                    />

                </label>

                {

                    file &&

                    <div className="file-info">

                        <p>

                            <strong>File Size :</strong>{" "}

                            {(file.size / 1024).toFixed(1)} KB

                        </p>

                    </div>

                }

                <button
                    onClick={handleUpload}
                    disabled={uploading}
                >

                    {

                        uploading

                            ?

                            "Uploading..."

                            :

                            "Upload Dataset"

                    }

                </button>

                {

                    message &&

                    <div className="upload-message">

                        <FaCheckCircle />

                        <span>{message}</span>

                    </div>

                }

            </div>

        </div>

    );

}

export default UploadPage;