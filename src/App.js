import React, { useState, useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker';

function App() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenPicker = () => {
    setLoading(true);
    openPicker({
      clientId: "648055946887-4er5sea1ghchnroe19sf761l6dtmme4i.apps.googleusercontent.com", 
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

  return (
    <div>
      <button onClick={handleOpenPicker}>Open Google Drive Picker</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {files && files.length > 0 ? (
            files.map((file) => (
              <p key={file.id}>{file.name}</p>
            ))
          ) : (
            <p>No files selected</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
