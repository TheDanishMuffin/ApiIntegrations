import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import useDrivePicker from 'react-google-drive-picker';

const myFirstElement = <h1>Hello!</h1>;

function App() {
    const [openPicker, data, authResponse] = useDrivePicker();
  
    const handleOpenPicker = () => {
        openPicker({
            clientId: "", // Add my clientId here
            developerKey: "", // Add my developerKey here
            viewId: "DOCS",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true
        });
    };
  
    useEffect(() => {
        if (data) {
            data.docs.map(i => console.log(i));
        }
    }, [data]);
  
    return (
        <div>
            <button onClick={handleOpenPicker}>Picky</button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
