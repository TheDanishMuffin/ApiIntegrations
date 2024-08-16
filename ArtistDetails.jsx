// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';

// const ArtistDetails = ({ artistId }) => {
//   const [artistData, setArtistData] = useState(null);
//   const [relatedArtists, setRelatedArtists] = useState([]);
//   const [playlist, setPlaylist] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTrack, setCurrentTrack] = useState(null);
//   const [lyrics, setLyrics] = useState('');
//   const [musicVideoUrl, setMusicVideoUrl] = useState('');

//   useEffect(() => {
//     if (!artistId) return;

//     const fetchArtistDetails = async () => {
//       try {
//         const response = await axios.get(`/api/spotify/artist/${artistId}`);
//         setArtistData(response.data);

//         // Fetch related artists
//         const relatedResponse = await axios.get(`/api/spotify/artist/${artistId}/related-artists`);
//         setRelatedArtists(relatedResponse.data.artists);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArtistDetails();
//   }, [artistId]);

//   const playTrackPreview = (previewUrl, trackId) => {
//     if (isPlaying) {
//       const audio = document.getElementById('audio-preview');
//       audio.pause();
//       setIsPlaying(false);
//     }

//     if (previewUrl) {
//       const audio = new Audio(previewUrl);
//       audio.id = 'audio-preview';
//       audio.play();
//       setIsPlaying(true);
//       setCurrentTrack(trackId);

//       // Fetch lyrics and music video
//       fetchLyricsAndVideo(trackId);
//     }
//   };

//   const fetchLyricsAndVideo = async (trackId) => {
//     try {
//       const lyricsResponse = await axios.get(`/api/spotify/track/${trackId}/lyrics`);
//       setLyrics(lyricsResponse.data.lyrics);

//       const videoResponse = await axios.get(`/api/spotify/track/${trackId}/music-video`);
//       setMusicVideoUrl(videoResponse.data.videoUrl);
//     } catch (err) {
//       console.error('Error fetching lyrics or music video:', err);
//     }
//   };

//   const addToPlaylist = (track) => {
//     setPlaylist([...playlist, track]);
//   };

//   const removeFromPlaylist = (trackId) => {
//     setPlaylist(playlist.filter((track) => track.id !== trackId));
//   };

//   const savePlaylist = async () => {
//     try {
//       const response = await axios.post('/api/spotify/save-playlist', { tracks: playlist });
//       alert('Playlist saved successfully! :)');
//     } catch (err) {
//       console.error('Error saving playlist :( ', err);
//     }
//   };

//   if (loading) return <div>Loading artist details...</div>;
//   if (error) return <div>Error fetching artist details: {error}</div>;

//   return (
//     <div className="artist-details">
//       {artistData && (
//         <>
//           <h2>{artistData.name}</h2>
//           <p>Genres: {artistData.genres.join(', ')}</p>
//           <img src={artistData.images[0]?.url} alt={artistData.name} />
//           <h3>Top Tracks</h3>
//           <ul>
//             {artistData.topTracks.map((track) => (
//               <li key={track.id}>
//                 {track.name} 
//                 <button onClick={() => playTrackPreview(track.preview_url, track.id)}>
//                   {isPlaying && currentTrack === track.id ? 'Stop Preview' : 'Play Preview'}
//                 </button>
//                 <button onClick={() => addToPlaylist(track)}>Add to Playlist</button>
//               </li>
//             ))}
//           </ul>

//           {lyrics && (
//             <div className="lyrics-section">
//               <h3>Lyrics</h3>
//               <pre>{lyrics}</pre>
//             </div>
//           )}

//           {musicVideoUrl && (
//             <div className="music-video-section">
//               <h3>Music Video</h3>
//               <iframe
//                 width="560"
//                 height="315"
//                 src={musicVideoUrl}
//                 title="Music Video"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               ></iframe>
//             </div>
//           )}

//           <h3>Playlist</h3>
//           <ul>
//             {playlist.map((track) => (
//               <li key={track.id}>
//                 {track.name} 
//                 <button onClick={() => removeFromPlaylist(track.id)}>Remove</button>
//               </li>
//             ))}
//           </ul>
//           <button onClick={savePlaylist}>Save Playlist</button>

//           <h3>Related Artists</h3>
//           <ul>
//             {relatedArtists.map((artist) => (
//               <li key={artist.id}>
//                 <img src={artist.images[0]?.url} alt={artist.name} style={{ width: '50px', marginRight: '10px' }} />
//                 {artist.name}
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// };

// ArtistDetails.propTypes = {
//   artistId: PropTypes.string.isRequired,
// };

// export default ArtistDetails;
