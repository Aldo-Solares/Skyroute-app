import { useState } from 'react'
import { changePassword } from '../services/UserService'
import { getUser } from '../storage/StorageService'
import './ProfilePassword.css'

function ProfilePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const setFeedback = (msg, error = false) => {
    setMessage(msg)
    setIsError(error)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    try {
      await changePassword(getUser(), oldPassword, newPassword)
      setOldPassword('')
      setNewPassword('')
      setFeedback('Password changed successfully')
    } catch (e) {
      const message = e.response?.data || 'Error'
      setFeedback(message, true)
    }
  }

  return (
    <>
      <h2 className="change-password-title">Change Password</h2>

      {message && (
        <p
          className={
            isError ? 'change-password-error' : 'change-password-success'
          }
        >
          {message}
        </p>
      )}

      <form onSubmit={handleChangePassword}>
        <div className="change-password-input-group">
          <label>Current password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="change-password-input-group">
          <label>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button className="change-password-button">Change Password</button>
      </form>
    </>
  )
}

export default ProfilePassword
