import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useDrivePicker from 'react-google-drive-picker';

function App() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [spotifyData, setSpotifyData] = useState([]);
  const artistIds = ['1Xyo4u8uXC1ZmMpatF05PJ', '3m49WVMU4zCkaVEKb8kFW7']; // Add more artist IDs here [weekend, ilayraja]

  const handleOpenPicker = () => {
    setLoading(true);
    openPicker({
      clientId: "648055946887-4er5sea1ghchnroe19sf761l6dtmme4i.apps.googleusercontent.com",
      developerKey: "", //MAKE SURE TO DELETE BEFORE COMMITTING
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
            'Authorization': 'Basic ' + btoa(':') //clientid:clientsecret
          },
          params: {
            grant_type: 'client_credentials'
          }
        });

        const accessToken = tokenResponse.data.access_token;

        const artistPromises = artistIds.map(id =>
          axios.get(`https://api.spotify.com/v1/artists/${id}`, {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          })
        );

        const topTracksPromises = artistIds.map(id =>
          axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
            headers: {
              'Authorization': 'Bearer ' + accessToken
            },
            params: {
              market: 'US'
            }
          })
        );

        const artistResults = await Promise.all(artistPromises.map(p => p.catch(e => e.response)));
        const topTracksResults = await Promise.all(topTracksPromises.map(p => p.catch(e => e.response)));

        const successfulArtistResults = artistResults.filter(result => result.status === 200);
        const successfulTopTracksResults = topTracksResults.filter(result => result.status === 200);

        const combinedResults = successfulArtistResults.map((result, index) => ({
          ...result.data,
          topTrack: successfulTopTracksResults[index].data.tracks[0]
        }));

        setSpotifyData(combinedResults);
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
      <div>
        {spotifyData.length > 0 ? (
          spotifyData.map((artist) => (
            <div key={artist.id} style={{ marginBottom: '20px' }}>
              <h2>{artist.name}</h2>
              <img src={artist.images[0]?.url} alt={artist.name} style={{ width: '200px', height: '200px' }} />
              <p>Followers: {artist.followers.total}</p>
              <p>Popularity: {artist.popularity}</p>
              <p>Genres: {artist.genres.join(', ')}</p>
              {artist.topTrack && (
                <div>
                  <p>Top Track: {artist.topTrack.name}</p>
                  <button onClick={() => window.open(artist.topTrack.preview_url, '_blank')}>
                    Listen to Top Track
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          error && <p>Error fetching Spotify data: {error.message}</p>
        )}
      </div>
    </div>
  );
}

export default App;
