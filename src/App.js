import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useDrivePicker from 'react-google-drive-picker';

function App() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [spotifyData, setSpotifyData] = useState(null);

  const handleOpenPicker = () => {
    setLoading(true);
    openPicker({
      clientId: "648055946887-4er5sea1ghchnroe19sf761l6dtmme4i.apps.googleusercontent.com",
      developerKey: "",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
    })
    .then((data) => {
      setLoading(false);
      setFiles(data.docs);
    })
    .catch((error) => {
      setLoading(false);
      setError(error);
      console.error("Error opening picker: ", error);
    });
  };

  useEffect(() => {
    if (data) {
      setLoading(false);
      setFiles(data.docs);
    }
  }, [data]);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa('YOUR_CLIENT_ID:YOUR_CLIENT_SECRET') //fill in here
          },
          params: {
            grant_type: 'client_credentials'
          }
        });

        const accessToken = tokenResponse.data.access_token;

        const artistResponse = await axios.get('https://api.spotify.com/v1/artists/1Xyo4u8uXC1ZmMpatF05PJ', { //fix this
          headers: {
            'Authorization': 'Bearer ' + accessToken
          }
        });

        setSpotifyData(artistResponse.data);
      } catch (error) {
        console.error("Error fetching Spotify data: ", error);
        setError(error);
      }
    };

    fetchSpotifyData();
  }, []);

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
      {spotifyData ? (
        <div>
          <h2>{spotifyData.name}</h2>
          <img src={spotifyData.images[0].url} alt={spotifyData.name} />
          <p>Followers: {spotifyData.followers.total}</p>
          <p>Popularity: {spotifyData.popularity}</p>
          <p>Genres: {spotifyData.genres.join(', ')}</p>
        </div>
      ) : (
        error && <p>Error fetching Spotify data: {error.message}</p>
      )}
    </div>
  );
}

export default App;
