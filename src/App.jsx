import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Configure API base URL - replace with your deployed API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://music-explorer-k1tk.onrender.com'

function App() {
  const [apiStatus, setApiStatus] = useState(null)
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Create playlist form state
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDescription, setPlaylistDescription] = useState('')
  const [creating, setCreating] = useState(false)

  // Fetch data from API
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Check API status
      const statusResponse = await axios.get(`${API_BASE_URL}/`)
      setApiStatus(statusResponse.data)
      
      // Fetch charts data
      const [tracksResponse, artistsResponse, playlistsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/charts/top-tracks`),
        axios.get(`${API_BASE_URL}/api/charts/top-artists`),
        axios.get(`${API_BASE_URL}/api/playlists`)
      ])
      
      setTracks(tracksResponse.data.slice(0, 10))
      setArtists(artistsResponse.data.slice(0, 10))
      setPlaylists(playlistsResponse.data)
      
    } catch (err) {
      console.error('API Error:', err)
      setError(`Failed to connect to API: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createPlaylist = async (e) => {
    e.preventDefault()
    
    if (!playlistName.trim()) {
      setError('Playlist name is required')
      return
    }
    
    setCreating(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/playlists`, {
        name: playlistName,
        description: playlistDescription
      })
      
      setPlaylists([...playlists, response.data])
      setPlaylistName('')
      setPlaylistDescription('')
      setSuccess('Playlist created successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (err) {
      console.error('Create playlist error:', err)
      setError(`Failed to create playlist: ${err.response?.data?.error || err.message}`)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1>Music Explorer</h1>
          <p className="loading">Loading music data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Music Explorer</h1>
        <p>Discover music and create playlists</p>
      </div>

      {/* API Status */}
      <div className="api-status">
        <h3>API Status</h3>
        {apiStatus ? (
          <div>
            <span className="status-online">✓ Connected</span>
            <p>{apiStatus.status} - {apiStatus.version}</p>
            <small>Last updated: {new Date(apiStatus.timestamp).toLocaleString()}</small>
          </div>
        ) : (
          <span className="status-offline">✗ Disconnected</span>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="grid">
        {/* Top Tracks */}
        <div className="card">
          <h2>🎵 Top Tracks</h2>
          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <div key={index} className="track-item">
                <div className="track-name">{track.name}</div>
                <div className="track-artist">by {track.artist?.name || 'Unknown Artist'}</div>
                {track.playcount && (
                  <div className="stats">Plays: {parseInt(track.playcount).toLocaleString()}</div>
                )}
              </div>
            ))
          ) : (
            <p className="loading">No tracks available</p>
          )}
        </div>

        {/* Top Artists */}
        <div className="card">
          <h2>🎤 Top Artists</h2>
          {artists.length > 0 ? (
            artists.map((artist, index) => (
              <div key={index} className="artist-item">
                <div className="artist-name">{artist.name}</div>
                {artist.playcount && (
                  <div className="stats">
                    Plays: {parseInt(artist.playcount).toLocaleString()}
                    {artist.listeners && ` • Listeners: ${parseInt(artist.listeners).toLocaleString()}`}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="loading">No artists available</p>
          )}
        </div>

        {/* Playlists */}
        <div className="card">
          <h2>📝 My Playlists</h2>
          
          {/* Create Playlist Form */}
          <div className="create-playlist">
            <form onSubmit={createPlaylist}>
              <div className="form-group">
                <label>Playlist Name</label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  disabled={creating}
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  placeholder="Enter description"
                  rows="3"
                  disabled={creating}
                />
              </div>
              <button type="submit" className="btn" disabled={creating}>
                {creating ? 'Creating...' : 'Create Playlist'}
              </button>
            </form>
          </div>

          {/* Existing Playlists */}
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div key={playlist.id || playlist._id} className="playlist-item">
                <div className="playlist-name">{playlist.name}</div>
                {playlist.description && (
                  <div className="stats">{playlist.description}</div>
                )}
                <div className="stats">
                  {playlist.tracks?.length || 0} tracks • 
                  Created: {new Date(playlist.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="loading">No playlists yet. Create your first playlist!</p>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', color: 'white', marginTop: '40px' }}>
        <p>Music Explorer - MERN Stack Application</p>
        <p>Frontend: React | Backend: Node.js + Express | Database: MongoDB | API: Last.fm</p>
      </div>
    </div>
  )
}

export default App