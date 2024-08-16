// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { db, auth } from './firebase'; 
// import { collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';

// const ArtistAlbums = ({ artistId }) => {
//   const [albums, setAlbums] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('');
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [favorites, setFavorites] = useState([]);
//   const [tags, setTags] = useState({});
//   const [tagFilter, setTagFilter] = useState('');
//   const [playlists, setPlaylists] = useState({});
//   const [newPlaylistName, setNewPlaylistName] = useState('');
//   const [sharedLinks, setSharedLinks] = useState({});
//   const [collaborativePlaylists, setCollaborativePlaylists] = useState({});
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const fetchAlbums = async () => {
//       try {
//         const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
//           headers: {
//             Authorization: `Bearer ${process.env.N}`
//           }
//         });
//         setAlbums(response.data.items);
//         setLoading(false);
//       } catch (err) {
//         setError(err);
//         setLoading(false);
//       }
//     };

//     fetchAlbums();
//   }, [artistId]);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   const createCollaborativePlaylist = async () => {
//     if (newPlaylistName) {
//       try {
//         const docRef = await addDoc(collection(db, "playlists"), {
//           name: newPlaylistName,
//           owner: currentUser.uid,
//           collaborators: [currentUser.uid],
//           albums: [],
//         });
//         setCollaborativePlaylists({
//           ...collaborativePlaylists,
//           [docRef.id]: {
//             name: newPlaylistName,
//             albums: [],
//             collaborators: [currentUser.uid],
//           }
//         });
//         setNewPlaylistName('');
//       } catch (e) {
//         console.error("Error adding document: ", e);
//       }
//     }
//   };

//   const addAlbumToCollaborativePlaylist = async (playlistId, album) => {
//     try {
//       const playlistRef = doc(db, "playlists", playlistId);
//       await updateDoc(playlistRef, {
//         albums: arrayUnion(album)
//       });
//     } catch (e) {
//       console.error("Error updating document: ", e);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "playlists"), (snapshot) => {
//       const updatedPlaylists = {};
//       snapshot.forEach(doc => {
//         updatedPlaylists[doc.id] = doc.data();
//       });
//       setCollaborativePlaylists(updatedPlaylists);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilter(e.target.value);
//   };

//   const handleSortChange = (e) => {
//     setSortOrder(e.target.value);
//   };

//   const addFavorite = (album) => {
//     setFavorites([...favorites, album]);
//   };

//   const removeFavorite = (albumId) => {
//     setFavorites(favorites.filter(album => album.id !== albumId));
//   };

//   const addTag = (albumId, tag) => {
//     setTags(prevTags => ({
//       ...prevTags,
//       [albumId]: [...(prevTags[albumId] || []), tag]
//     }));
//   };

//   const removeTag = (albumId, tag) => {
//     setTags(prevTags => ({
//       ...prevTags,
//       [albumId]: prevTags[albumId].filter(t => t !== tag)
//     }));
//   };

//   const handleTagFilterChange = (e) => {
//     setTagFilter(e.target.value);
//   };

//   const createPlaylist = () => {
//     if (newPlaylistName) {
//       setPlaylists({
//         ...playlists,
//         [newPlaylistName]: []
//       });
//       setNewPlaylistName('');
//     }
//   };

//   const addToPlaylist = (playlistName, album) => {
//     setPlaylists({
//       ...playlists,
//       [playlistName]: [...playlists[playlistName], album]
//     });
//   };

//   const removeFromPlaylist = (playlistName, albumId) => {
//     setPlaylists({
//       ...playlists,
//       [playlistName]: playlists[playlistName].filter(album => album.id !== albumId)
//     });
//   };

//   const generateShareableLink = (playlistName) => {
//     const baseURL = 'https://yourapp.com/playlist';
//     const link = `${baseURL}/${encodeURIComponent(playlistName)}`;
//     setSharedLinks({
//       ...sharedLinks,
//       [playlistName]: link
//     });
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     alert('Link copied to clipboard!');
//   };

//   const shareOnSocialMedia = (platform, link) => {
//     let url = '';
//     switch (platform) {
//       case 'twitter':
//         url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`;
//         break;
//       case 'facebook':
//         url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
//         break;
//       default:
//         break;
//     }
//     window.open(url, '_blank');
//   };

//   const filteredAlbums = albums.filter(album => 
//     album.name.toLowerCase().includes(filter.toLowerCase()) &&
//     (!tagFilter || (tags[album.id] && tags[album.id].includes(tagFilter.toLowerCase())))
//   );

//   const sortedAlbums = [...filteredAlbums].sort((a, b) => {
//     if (sortOrder === 'asc') {
//       return new Date(a.release_date) - new Date(b.release_date);
//     } else {
//       return new Date(b.release_date) - new Date(a.release_date);
//     }
//   });

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error fetching albums: {error.message}</div>;
//   }

//   return (
//     <div>
//       <h2>Albums</h2>
//       <input 
//         type="text" 
//         placeholder="Filter albums..." 
//         value={filter} 
//         onChange={handleFilterChange} 
//       />
//       <select value={sortOrder} onChange={handleSortChange}>
//         <option value="desc">Sort by Release Date (Descending)</option>
//         <option value="asc">Sort by Release Date (Ascending)</option>
//       </select>
//       <input 
//         type="text" 
//         placeholder="Filter by tag..." 
//         value={tagFilter} 
//         onChange={handleTagFilterChange} 
//       />
//       <div>
//         <input 
//           type="text" 
//           placeholder="New playlist name..." 
//           value={newPlaylistName} 
//           onChange={(e) => setNewPlaylistName(e.target.value)} 
//         />
//         <button onClick={createPlaylist}>Create Playlist</button>
//       </div>
//       <div>
//         <input 
//           type="text" 
//           placeholder="New collaborative playlist name..." 
//           value={newPlaylistName} 
//           onChange={(e) => setNewPlaylistName(e.target.value)} 
//         />
//         <button onClick={createCollaborativePlaylist}>Create Collaborative Playlist</button>
//       </div>
//       <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//         {sortedAlbums.map(album => (
//           <div key={album.id} style={{ margin: '10px' }}>
//             <img 
//               src={album.images[0]?.url || ''} 
//               alt={album.name} 
//               style={{ width: '150px', height: '150px' }}
//             />
//             <p>{album.name}</p>
//             <p>Release Date: {album.release_date}</p>
//             <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
//               Open in Spotify
//             </a>
//             <button onClick={() => addFavorite(album)}>Add to Favorites</button>
//             <button onClick={() => removeFavorite(album.id)}>Remove from Favorites</button>
//             <div>
//               <input 
//                 type="text" 
//                 placeholder="Add tag..." 
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && e.target.value) {
//                     addTag(album.id, e.target.value.toLowerCase());
//                     e.target.value = '';
//                   }
//                 }} 
//               />
//               <div>
//                 {tags[album.id]?.map(tag => (
//                   <span key={tag} style={{ marginRight: '5px' }}>
//                     {tag} <button onClick={() => removeTag(album.id, tag)}>x</button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <div>
//               {Object.keys(playlists).map(playlistName => (
//                 <div key={playlistName}>
//                   <button onClick={() => addToPlaylist(playlistName, album)}>Add to {playlistName}</button>
//                 </div>
//               ))}
//             </div>
//             <div>
//               {Object.keys(collaborativePlaylists).map(playlistId => (
//                 <div key={playlistId}>
//                   <h3>{collaborativePlaylists[playlistId].name}</h3>
//                   <button onClick={() => addAlbumToCollaborativePlaylist(playlistId, album)}>
//                     Add to {collaborativePlaylists[playlistId].name}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div>
//         <h2>Your Playlists</h2>
//         {Object.keys(playlists).map(playlistName => (
//           <div key={playlistName}>
//             <h3>{playlistName}</h3>
//             <ul>
//               {playlists[playlistName].map(album => (
//                 <li key={album.id}>
//                   {album.name}
//                   <button onClick={() => removeFromPlaylist(playlistName, album.id)}>Remove</button>
//                 </li>
//               ))}
//             </ul>
//             <button onClick={() => generateShareableLink(playlistName)}>Generate Shareable Link here!</button>
//             {sharedLinks[playlistName] && (
//               <div>
//                 <p>{sharedLinks[playlistName]}</p>
//                 <button onClick={() => copyToClipboard(sharedLinks[playlistName])}>Copy Link</button>
//                 <button onClick={() => shareOnSocialMedia('twitter', sharedLinks[playlistName])}>Share on Twitter</button>
//                 <button onClick={() => shareOnSocialMedia('facebook', sharedLinks[playlistName])}>Share on Facebook</button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ArtistAlbums;
