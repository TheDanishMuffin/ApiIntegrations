<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
  {/* Search input for filtering artists */}
  <input
    type="text"
    placeholder="Search artists here..."
    value={searchQuery}
    onChange={handleSearchChange}
    style={{ 
      marginBottom: '20px', 
      padding: '10px', 
      fontSize: '16px', 
      width: '300px', 
      borderRadius: '5px', 
      border: '1px solid #ccc' 
    }}
  />
  {filteredSpotifyData.length > 0 ? (
    filteredSpotifyData.map((artist) => (
      <div 
        key={artist.id} 
        style={{ 
          marginBottom: '40px', 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
        }}
      >
        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{artist.name}</h2>
        <img 
          src={artist.images[0]?.url} 
          alt={artist.name} 
          style={{ 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            border: '2px solid #333' 
          }} 
        />
        <p><strong>Followers:</strong> {artist.followers.total.toLocaleString()}</p>
        <p><strong>Popularity:</strong> {artist.popularity}</p>
        <p><strong>Genres:</strong> {artist.genres.join(', ')}</p>
        
        {artist.topTrack ? (
          artist.topTrack.preview_url ? (
            <div>
              <p><strong>Most Listened Track:</strong> {artist.topTrack.name}</p>
              <button 
                onClick={() => window.open(artist.topTrack.preview_url, '_blank')}
                style={{ 
                  padding: '10px 15px', 
                  backgroundColor: '#1db954', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                Listen to Most Listened Track
              </button>
            </div>
          ) : (
            <p>Top track preview not available</p>
          )
        ) : (
          <p>No top track available</p>
        )}

        {artist.socialMedia && (
          <div style={{ marginTop: '10px' }}>
            <p><strong>Follow on:</strong></p>
            {artist.socialMedia.twitter && <a href={artist.socialMedia.twitter} target="_blank" style={{ marginRight: '10px', textDecoration: 'none', color: '#1DA1F2' }}>Twitter</a>}
            {artist.socialMedia.instagram && <a href={artist.socialMedia.instagram} target="_blank" style={{ marginRight: '10px', textDecoration: 'none', color: '#C13584' }}>Instagram</a>}
            {artist.socialMedia.facebook && <a href={artist.socialMedia.facebook} target="_blank" style={{ textDecoration: 'none', color: '#1877F2' }}>Facebook</a>}
          </div>
        )}

        {artist.recentAlbum && (
          <div style={{ marginTop: '20px' }}>
            <h3>Recent Album: {artist.recentAlbum.name}</h3>
            <img 
              src={artist.recentAlbum.coverUrl} 
              alt={artist.recentAlbum.name} 
              style={{ 
                width: '150px', 
                height: '150px', 
                borderRadius: '10px', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
              }} 
            />
            <p>Release Date: {artist.recentAlbum.releaseDate}</p>
            <p>Tracks: {artist.recentAlbum.totalTracks}</p>
            <button 
              onClick={() => window.open(artist.recentAlbum.spotifyUrl, '_blank')}
              style={{ 
                padding: '10px 15px', 
                backgroundColor: '#1db954', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Listen on Spotify
            </button>
          </div>
        )}
      </div>
    ))
  ) : (
    error && <p style={{ color: 'red' }}>Error fetching Spotify data: {error.message}</p>
  )}
</div>