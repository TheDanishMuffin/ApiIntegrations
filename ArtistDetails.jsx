import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const ArtistDetails = ({ artistId }) => {
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artistId) return;

    const fetchArtistDetails = async () => {
      try {
        const response = await axios.get(`/api/spotify/artist/${artistId}`);
        setArtistData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

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
              <li key={track.id}>{track.name}</li>
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
