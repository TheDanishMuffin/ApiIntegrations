import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [artistData, setArtistData] = useState({});

  useEffect(() => {
    axios.post('https://accounts.spotify.com/api/token', {
      grant_type: 'client_credentials',
      client_id: '', // make sure to fill in these two with the up to date one 
      client_secret: '',
    })
    .then(response => {
      setAccessToken(response.data.access_token);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
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
      <h1>The Weeknd's Stats</h1>
      <p>Name: {artistData.name}</p>
      <p>Popularity: {artistData.popularity}</p>
      <p>Followers: {artistData.followers.total}</p>
    </div>
  );
}
