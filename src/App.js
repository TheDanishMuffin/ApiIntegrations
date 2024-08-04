import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useDrivePicker from 'react-google-drive-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [openPicker, data, authResponse] = useDrivePicker();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [spotifyData, setSpotifyData] = useState([]);
  const [input, setInput] = useState('');
  const [inputLoading, setInputLoading] = useState(false);
  const [inputError, setInputError] = useState(null);
  const artistIds = [
    '1Xyo4u8uXC1ZmMpatF05PJ', 
    '246dkjvS1zLTtiykXe5h60',
    '6Ip8FS7vWT1uKkJSweANQK',
    '5H4yInM5zmHqpKIoMNAx4r',
    '0Y5tJX1MQlPlqiwlOH1tJY',
    '3qiHUAX7zY4Qnjx8TNUzVx',
    '2YZyLoL8N0Wb9xBt1NhZWg'
  ];

  const handleOpenPicker = () => {
    setLoading(true);
    openPicker({
      clientId: "648055946887-4er5sea1ghchnroe19sf761l6dtmme4i.apps.googleusercontent.com",
      developerKey: "AIzaSyCciSnW0Ap8k_Mxz3kLXC-EQ_d5adr415I",
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
            'Authorization': 'Basic ' + btoa('3ffa028c03264558b76235ada2d307af:54d530cb2c574a41a0e8c79dbf6edc3e')
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputLoading(true);

    try {
      await addDoc(collection(db, 'userInputs'), {
        input,
        timestamp: new Date(),
      });
      setInput('');
      setInputLoading(false);
    } catch (err) {
      setInputError(err);
      setInputLoading(false);
    }
  };

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
              {artist.topTrack ? (
                artist.topTrack.preview_url ? (
                  <div>
                    <p>Most Listened Track: {artist.topTrack.name}</p>
                    <button onClick={() => window.open(artist.topTrack.preview_url, '_blank')}>
                      Listen to Most Listened Track
                    </button>
                  </div>
                ) : (
                  <p>Top track preview not available</p>
                )
              ) : (
                <p>No top track available</p>
              )}
            </div>
          ))
        ) : (
          error && <p>Error fetching Spotify data: {error.message}</p>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter something..."
          required
        />
        <button type="submit" disabled={inputLoading}>
          {inputLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {inputError && <p>Error: {inputError.message}</p>}
    </div>
  );
}

export default App;
