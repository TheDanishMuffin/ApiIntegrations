import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ArtistAlbums = ({ artistId }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
          headers: {
            Authorization: `Bearer ${process.env.N}`
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

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const addFavorite = (album) => {
    setFavorites([...favorites, album]);
  };

  const removeFavorite = (albumId) => {
    setFavorites(favorites.filter(album => album.id !== albumId));
  };

  const filteredAlbums = albums.filter(album => 
    album.name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.release_date) - new Date(b.release_date);
    } else {
      return new Date(b.release_date) - new Date(a.release_date);
    }
  });

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
      <select value={sortOrder} onChange={handleSortChange}>
        <option value="desc">Sort by Release Date (Descending)</option>
        <option value="asc">Sort by Release Date (Ascending)</option>
      </select>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {sortedAlbums.map(album => (
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
            <button onClick={() => addFavorite(album)}>Add to Favorites</button>
            <button onClick={() => removeFavorite(album.id)}>Remove from Favorites</button>
          </div>
        ))}
      </div>
      <h2>Favorites</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {favorites.map(album => (
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
            <button onClick={() => removeFavorite(album.id)}>Remove from Favorites</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistAlbums;