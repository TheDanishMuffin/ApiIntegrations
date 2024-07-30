import React, { useState, useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker';
import axios from 'axios';

function App() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [accessToken, setAccessToken] = useState('');
  const [artistData, setArtistData] = useState({});

  const handleOpenPicker = () => {
    setLoading(true);
    openPicker({
      clientId: "YOUR_CLIENT_ID", // Add
      developerKey: "YOUR_DEVELOPER_KEY", // Add
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
    // Getin an access token for Spotify API
    axios.post('https://accounts.spotify.com/api/token', {
      grant_type: 'client_credentials',
      client_id: 'YOUR_SPOTIFY_CLIENT_ID',
      client_secret: 'YOUR_SPOTIFY_CLIENT_SECRET',
    })
    .then(response => {
      setAccessToken(response.data.access_token);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    // Get The Weeknd's artist data from Spotify API
    if (accessToken) {
      axios.get(`https://api.spotify.com/v1/artists/theweeknd`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        setArtistData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [accessToken]);

  return (
    <div>
      <button onClick={handleOpenPicker}>Open Google Drive Picker</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {files.map((file) => (
            <p key={file.id}>{file.name}</p>
          ))}
        </div>
      )}
      <h1>The Weeknd's Stats</h1>
      <p>Name: {artistData.name}</p>
      <p>Popularity: {artistData.popularity}</p>
      <p>Followers: {artistData.followers.total}</p>
    </div>
  );
}
