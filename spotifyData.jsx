<div>
  {/* Search input for filtering artists */}
  <input
    type="text"
    placeholder="Search artists here..."
    value={searchQuery}
    onChange={handleSearchChange}
    style={{ marginBottom: '20px' }}
  />
  {filteredSpotifyData.length > 0 ? (
    filteredSpotifyData.map((artist) => (
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
