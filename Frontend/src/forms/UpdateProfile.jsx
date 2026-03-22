import { useState, useEffect } from 'react'
import {
  updateUserProfile,
  getUserInfo,
  getUserImage,
} from '../services/UserService'

import { getUser, setUser, setImgProfile } from '../storage/StorageService'
import './UpdateProfile.css'

function UpdateProfile() {
  const [username, setUsername] = useState('')
  const [originalUsername, setOriginalUsername] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [currentImg, setCurrentImg] = useState(null)

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const setFeedback = (msg, error = false) => {
    setMessage(msg)
    setIsError(error)
  }

  const loadUserData = async () => {
    try {
      const currentUser = getUser()
      setUsername(currentUser)
      setOriginalUsername(currentUser)

      const data = await getUserInfo(currentUser)
      if (data?.img) {
        setCurrentImg(getUserImage(data.img) + `?t=${Date.now()}`)
      }
    } catch {}
  }

  useEffect(() => {
    loadUserData()
  }, [])

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const applyUserUpdate = (data) => {
    if (data?.username) {
      setUser(data.username)
      setUsername(data.username)
      setOriginalUsername(data.username)
    }

    if (data?.jwt) {
      localStorage.setItem('Token', data.jwt)
    }

    if (data?.img) {
      setImgProfile(data.img)
      setCurrentImg(getUserImage(data.img) + `?t=${Date.now()}`)
    }

    setPreview(null)
    window.dispatchEvent(new Event('userUpdated'))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    try {
      const data = await updateUserProfile(originalUsername, username, file)
      applyUserUpdate(data)
      setFeedback('Profile updated successfully')
    } catch (e) {
      const errorMsg = e.response?.data || 'Unexpected error'

      setFeedback(errorMsg, true)
    }
  }

  return (
    <>
      <h2>Profile Settings</h2>

      <form onSubmit={handleUpdateProfile}>
        <div className="profile-avatar-preview">
          {preview && <img src={preview} alt="preview" />}
          {!preview && currentImg && <img src={currentImg} alt="profile" />}
        </div>

        {message && (
          <p className={isError ? 'profile-error' : 'profile-success'}>
            {message}
          </p>
        )}

        <div className="profile-input-group">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="custom-file">
          <label>
            <input type="file" onChange={handleFileChange} />
            <span>Select image</span>
          </label>
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </>
  )
}

export default UpdateProfile
