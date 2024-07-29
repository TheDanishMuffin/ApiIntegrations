import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import useDrivePicker from 'react-google-drive-picker';
import axios from 'axios';

const myFirstElement = <h1>Hello!</h1>;

function App() {
    const [openPicker, data, authResponse] = useDrivePicker();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOpenPicker = () => {
        setLoading(true);
        openPicker({
            clientId: ",
            developerKey: "",
            viewId: "DOCS",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true
        });
    };

    useEffect(() => {
        if (data) {
            setLoading(false);
            setFiles(data.docs);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            setLoading(false);
            console.error(error);
        }
    }, [error]);

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post('https://api-endpoint.com/upload', formData);
            console.log(response.data);
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div>
            <button onClick={handleOpenPicker}>Picky here!</button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {files.map((file) => (
                        <p key={file.id}>{file.name}</p>
                    ))}
                    <button onClick={() => handleFileUpload(files[0])}>Upload File</button>
                </div>
            )}
            {error ? (
                <p style={{ color: 'red' }}>{error.message}</p>
            ) : null}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
