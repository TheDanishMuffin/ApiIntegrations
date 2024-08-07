
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArtistAlbums = ({ artistId }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
          headers: {
            Authorization: `Bearer ${process.env.PLUG ACEESS TOCEN HERE}`
          }
        });
        setAlbums(response.data.items);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [artistId]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredAlbums = albums.filter(album => 
    album.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching albums: {error.message}</div>;
  }

  return (
    <div>
      <h2>Albums</h2>
      <input 
        type="text" 
        placeholder="Filter albums..." 
        value={filter} 
        onChange={handleFilterChange} 
      />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredAlbums.map(album => (
          <div key={album.id} style={{ margin: '10px' }}>
            <img 
              src={album.images[0]?.url || 'https://via.placeholder.com/150'} 
              alt={album.name} 
              style={{ width: '150px', height: '150px' }}
            />
            <p>{album.name}</p>
            <p>Release Date: {album.release_date}</p>
            <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              Open in Spotify
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistAlbums;