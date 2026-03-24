import { useState } from 'react'
import UpdateProfile from '../components/forms/UpdateProfile'
import ProfilePassword from '../components/forms/ProfilePassword'
import './ProfileSettings.css'

function ProfileSettings() {
  const [view, setView] = useState('profile')

  return (
    <div className="Profile-Page">
      <div className="Profile-Container">
        <div className="Profile-Card">
          {view === 'profile' && (
            <>
              <UpdateProfile />

              <div
                className="profile-switch right"
                onClick={() => setView('password')}
              >
                <span>Change password</span>
                <span className="arrow">→</span>
              </div>
            </>
          )}

          {view === 'password' && (
            <>
              <ProfilePassword />

              <div
                className="profile-switch left"
                onClick={() => setView('profile')}
              >
                <span className="arrow">←</span>
                <span>Back to profile</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
