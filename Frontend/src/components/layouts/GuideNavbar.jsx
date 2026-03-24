import './GuideNavbar.css'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  getUser,
  getRole,
  getImgProfile,
  clearSession,
} from '../../storage/StorageService'
import { getUserImage } from '../../services/UserService'

function GuideNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = useLocation()

  const [username, setUsername] = useState('')
  const [img, setImg] = useState('')
  const [role, setRole] = useState('')
  const [refresh, setRefresh] = useState(0)

  /* ===============================
     PAGE CONTEXT
  =============================== */

  const isTransparentWhite =
    location.pathname === '/home' ||
    location.pathname === '/home/create-category' ||
    [
      'profile',
      'Cities',
      'Mangroves',
      'Forests',
      'Mangroves',
      'Reefs',
      'Tundra',
      'Beaches',
    ].some((keyword) => location.pathname.includes(keyword))

  const isCreateCategory = pathname === '/home'
  const isCreatePage = location.pathname.startsWith('/category/')
  const categoryName = location.pathname.split('/').pop()

  /* ===============================
     USER SYNC
  =============================== */

  useEffect(() => {
    const sync = () => {
      const user = getUser()
      const imgStorage = getImgProfile()
      const roleStorage = getRole()

      setUsername(user || '')
      setRole(roleStorage || '')

      if (imgStorage && imgStorage !== 'null' && imgStorage !== 'undefined') {
        setImg(imgStorage)
      } else {
        setImg('')
      }

      setRefresh((prev) => prev + 1)
    }

    sync()
    window.addEventListener('userUpdated', sync)
    return () => window.removeEventListener('userUpdated', sync)
  }, [])

  /* ===============================
     HELPERS
  =============================== */

  const profileImg = img ? getUserImage(img) + '?t=' + refresh : null

  const initials =
    username
      ?.split(' ')
      ?.map((p) => p[0]?.toUpperCase())
      ?.slice(0, 2)
      ?.join('') || 'U'

  const go = (path) => {
    if (location.pathname !== path) {
      navigate(path)
    }
  }

  const logout = () => {
    clearSession()
    navigate('/login')
  }

  /* ===============================
     RENDER
  =============================== */

  return (
    <div className="div-nav">
      <nav
        className={`GuideNavbar-Container ${
          isTransparentWhite ? 'transparent-white' : ''
        }`}
      >
        <div id="title" onClick={() => go('/home')}>
          <img
            src={isTransparentWhite ? '/images/LogoW.ico' : '/images/Logo.ico'}
            alt="logo"
          />
          <h1>SkyRoute</h1>
        </div>

        <div className="right-actions">
          <div id="div-buttons">
            {role === 'ROLE_ADMIN' && isCreateCategory && !isCreatePage && (
              <button
                className="nav-item"
                onClick={() => go('/home/create-category')}
              >
                Create Category
              </button>
            )}

            {role === 'ROLE_ADMIN' && !isCreateCategory && isCreatePage && (
              <button
                className="nav-item"
                onClick={() => go(`/home/create-place/${categoryName}`)}
              >
                Create Place
              </button>
            )}

            <Link to="/home" className="nav-item">
              Home
            </Link>
          </div>

          <div className="profile-wrapper">
            <div className="profile-tile">
              <span className="username">{username}</span>

              {profileImg ? (
                <img
                  key={refresh}
                  src={profileImg}
                  className="avatar"
                  alt="avatar"
                />
              ) : (
                <div className="avatar initials">{initials}</div>
              )}
            </div>

            <div className="profile-dropdown">
              <button
                className="dropdown-item"
                onClick={() => go('/profile/favorites-places')}
              >
                Favorites Places
              </button>

              <button
                className="dropdown-item"
                onClick={() => go('/profile/profile-settings')}
              >
                Profile Settings
              </button>

              <button className="dropdown-item danger" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default GuideNavbar
