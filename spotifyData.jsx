<div>
  {/* Search input for filtering artists */}
  <input
    type="text"
    placeholder="Search artists here..."
    value={searchQuery}
    onChange={handleSearchChange}
    style={{ marginBottom: '20px', padding: '10px', fontSize: '16px', width: '300px' }}
  />
  {filteredSpotifyData.length > 0 ? (
    filteredSpotifyData.map((artist) => (
      <div key={artist.id} style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{artist.name}</h2>
        <img src={artist.images[0]?.url} alt={artist.name} style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
        <p><strong>Followers:</strong> {artist.followers.total.toLocaleString()}</p>
        <p><strong>Popularity:</strong> {artist.popularity}</p>
        <p><strong>Genres:</strong> {artist.genres.join(', ')}</p>
        
        {artist.topTrack ? (
          artist.topTrack.preview_url ? (
            <div>
              <p><strong>Most Listened Track:</strong> {artist.topTrack.name}</p>
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

        {artist.socialMedia && (
          <div style={{ marginTop: '10px' }}>
            <p><strong>Follow on:</strong></p>
            {artist.socialMedia.twitter && <a href={artist.socialMedia.twitter} target="_blank" style={{ marginRight: '10px' }}>Twitter</a>}
            {artist.socialMedia.instagram && <a href={artist.socialMedia.instagram} target="_blank" style={{ marginRight: '10px' }}>Instagram</a>}
            {artist.socialMedia.facebook && <a href={artist.socialMedia.facebook} target="_blank">Facebook</a>}
          </div>
        )}

        {artist.recentAlbum && (
          <div style={{ marginTop: '20px' }}>
            <h3>Recent Album: {artist.recentAlbum.name}</h3>
            <img src={artist.recentAlbum.coverUrl} alt={artist.recentAlbum.name} style={{ width: '150px', height: '150px' }} />
            <p>Release Date: {artist.recentAlbum.releaseDate}</p>
            <p>Tracks: {artist.recentAlbum.totalTracks}</p>
            <button onClick={() => window.open(artist.recentAlbum.spotifyUrl, '_blank')}>
              Listen on Spotify
            </button>
          </div>
        )}
      </div>
    ))
  ) : (
    error && <p>Error fetching Spotify data: {error.message}</p>
  )}
</div>