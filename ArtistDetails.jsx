import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const ArtistDetails = ({ artistId }) => {
  const [artistData, setArtistData] = useState(null);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    if (!artistId) return;

    const fetchArtistDetails = async () => {
      try {
        const response = await axios.get(`/api/spotify/artist/${artistId}`);
        setArtistData(response.data);

        // Fetch related artists
        const relatedResponse = await axios.get(`/api/spotify/artist/${artistId}/related-artists`);
        setRelatedArtists(relatedResponse.data.artists);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  const playTrackPreview = (previewUrl) => {
    if (isPlaying) {
      const audio = document.getElementById('audio-preview');
      audio.pause();
      setIsPlaying(false);
    }
    
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.id = 'audio-preview';
      audio.play();
      setIsPlaying(true);
      setCurrentTrack(previewUrl);
    }
  };

  const addToPlaylist = (track) => {
    setPlaylist([...playlist, track]);
  };

  const removeFromPlaylist = (trackId) => {
    setPlaylist(playlist.filter((track) => track.id !== trackId));
  };

  const savePlaylist = async () => {
    try {
      const response = await axios.post('/api/spotify/save-playlist', { tracks: playlist });
      alert('Playlist saved successfully! Yay :)');
    } catch (err) {
      console.error('Error saving playlist bruh:', err);
    }
  };

  if (loading) return <div>Loading artist details...</div>;
  if (error) return <div>Error fetching artist details: {error}</div>;

  return (
    <div className="artist-details">
      {artistData && (
        <>
          <h2>{artistData.name}</h2>
          <p>Genres: {artistData.genres.join(', ')}</p>
          <img src={artistData.images[0]?.url} alt={artistData.name} />
          <h3>Top Tracks</h3>
          <ul>
            {artistData.topTracks.map((track) => (
              <li key={track.id}>
                {track.name} 
                <button onClick={() => playTrackPreview(track.preview_url)}>
                  {isPlaying && currentTrack === track.preview_url ? 'Stop Preview' : 'Play Preview'}
                </button>
                <button onClick={() => addToPlaylist(track)}>Add to Playlist</button>
              </li>
            ))}
          </ul>

          <h3>Playlist</h3>
          <ul>
            {playlist.map((track) => (
              <li key={track.id}>
                {track.name} 
                <button onClick={() => removeFromPlaylist(track.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={savePlaylist}>Save Playlist</button>

          <h3>Related Artists</h3>
          <ul>
            {relatedArtists.map((artist) => (
              <li key={artist.id}>
                <img src={artist.images[0]?.url} alt={artist.name} style={{ width: '50px', marginRight: '10px' }} />
                {artist.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

ArtistDetails.propTypes = {
  artistId: PropTypes.string.isRequired,
};

export default ArtistDetails;
