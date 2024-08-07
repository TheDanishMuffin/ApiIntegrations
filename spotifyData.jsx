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
        
        {artist.topTrack && (
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

        {artist.tourDates && (
          <div style={{ marginTop: '20px' }}>
            <h3>Upcoming Tour Dates:</h3>
            {artist.tourDates.length > 0 ? (
              <ul style={{ padding: '0', listStyleType: 'none' }}>
                {artist.tourDates.map((date, index) => (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <p><strong>Venue:</strong> {date.venue}</p>
                    <p><strong>Date:</strong> {new Date(date.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {date.location}</p>
                    <a href={date.ticketUrl} target="_blank" style={{ color: '#1db954' }}>Buy Tickets</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming tour dates available</p>
            )}
          </div>
        )}

        {artist.similarArtists && (
          <div style={{ marginTop: '20px' }}>
            <h3>Similar Artists:</h3>
            {artist.similarArtists.length > 0 ? (
              <ul style={{ padding: '0', listStyleType: 'none' }}>
                {artist.similarArtists.map((similarArtist) => (
                  <li key={similarArtist.id} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={similarArtist.images[0]?.url} 
                        alt={similarArtist.name} 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '50%', 
                          marginRight: '10px' 
                        }} 
                      />
                      <p><strong>{similarArtist.name}</strong></p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No similar artists found</p>
            )}
          </div>
        )}

        {artist.userReviews && (
          <div style={{ marginTop: '20px' }}>
            <h3>User Reviews:</h3>
            {artist.userReviews.length > 0 ? (
              <ul style={{ padding: '0', listStyleType: 'none' }}>
                {artist.userReviews.map((review, index) => (
                  <li key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <p><strong>{review.username}</strong> ({new Date(review.date).toLocaleDateString()})</p>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No user reviews available</p>
            )}
          </div>
        )}

        {artist.relatedPlaylists && (
          <div style={{ marginTop: '20px' }}>
            <h3>Related Playlists:</h3>
            {artist.relatedPlaylists.length > 0 ? (
              <ul style={{ padding: '0', listStyleType: 'none' }}>
                {artist.relatedPlaylists.map((playlist) => (
                  <li key={playlist.id} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={playlist.images[0]?.url} 
                        alt={playlist.name} 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '5px', 
                          marginRight: '10px' 
                        }} 
                      />
                      <p><strong>{playlist.name}</strong></p>
                      <a href={playlist.spotifyUrl} target="_blank" style={{ marginLeft: '10px', color: '#1db954' }}>Listen</a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No related playlists available</p>
            )}
          </div>
        )}

        {artist.relatedAlbums && (
          <div style={{ marginTop: '20px' }}>
            <h3>Related Albums:</h3>
            {artist.relatedAlbums.length > 0 ? (
              <ul style={{ padding: '0', listStyleType: 'none' }}>
                {artist.relatedAlbums.map((album) => (
                  <li key={album.id} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={album.coverUrl} 
                        alt={album.name} 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '5px', 
                          marginRight: '10px' 
                        }} 
                      />
                      <p><strong>{album.name}</strong></p>
                      <a href={album.spotifyUrl} target="_blank" style={{ marginLeft: '10px', color: '#1db954' }}>Listen</a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No related albums available</p>
            )}
          </div>
        )}

        {artist.musicVideos && (
          <div style={{ marginTop: '20px' }}>
            <h3>Music Videos:</h3>
            {artist.musicVideos.length > 0 ? (
              <ul style={{ padding: '0', listStyleType: 'none' }}>
                {artist.musicVideos.map((video, index) => (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '5px', 
                          marginRight: '10px' 
                        }} 
                      />
                      <p><strong>{video.title}</strong></p>
                      <a href={video.youtubeUrl} target="_blank" style={{ marginLeft: '10px', color: '#FF0000' }}>Watch</a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No music videos available</p>
            )}
          </div>
        )}

        {artist.fanArt && (
          <div style={{ marginTop: '20px' }}>
            <h3>Fan Art:</h3>
            {artist.fanArt.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {artist.fanArt.map((art, index) => (
                  <div key={index} style={{ width: '100px', height: '100px' }}>
                    <img 
                      src={art.url} 
                      alt={`Fan art ${index + 1}`} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        borderRadius: '10px', 
                        objectFit: 'cover', 
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
                      }} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No fan art available</p>
            )}
          </div>
        )}

        {artist.merchandise && (
          <div style={{ marginTop: '20px' }}>
            <h3>Merchandise:</h3>
            {artist.merchandise.length > 0 ? (
              <ul style={{ padding: '0', listStyleType: 'none' }}>
                {artist.merchandise.map((item, index) => (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '5px', 
                          marginRight: '10px' 
                        }} 
                      />
                      <p><strong>{item.name}</strong></p>
                      <a href={item.shopUrl} target="_blank" style={{ marginLeft: '10px', color: '#000' }}>Buy Now</a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No merchandise available</p>
            )}
          </div>
        )}

        {artist.biography && (
          <div style={{ marginTop: '20px' }}>
            <h3>Biography:</h3>
            <p>{artist.biography}</p>
          </div>
        )}

        {artist.achievements && (
          <div style={{ marginTop: '20px' }}>
            <h3>Achievements:</h3>
            <ul style={{ padding: '0', listStyleType: 'none' }}>
              {artist.achievements.map((achievement, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  <p><strong>{achievement.title}</strong></p>
                  <p>{achievement.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    ))
  ) : (
    <p>No artists found</p>
  )}
</div>
