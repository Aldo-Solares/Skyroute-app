import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import NavbarOnlyLayout from './components/layouts/NavbarOnlyLayout'
import ErrorPage from './pages/ErrorPage'
import HomePage from './pages/HomePage'
import CreateCategory from './pages/CreateCategory'
import CreatePlace from './pages/CreatePlace'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './security/ProtectedRoute'
import PlacePage from './pages/PlacePage'
import ProfileSettings from './pages/ProfileSettings'
import FavoritesPlaces from './pages/FavoritesPlaces'
import './App.css'

function App() {
  return (
    <Routes>
      {/* ===== AUTH ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== NAVBAR + CONTACT ===== */}
      <Route element={<MainLayout />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route path="/category/:categoryName" element={<PlacePage />} />
      </Route>

      {/* ===== NavbarOnlyLayout ===== */}
      <Route element={<NavbarOnlyLayout />}>
        <Route
          path="/home/create-category"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <CreateCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home/create-place/:categoryName"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <CreatePlace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/favorites-places"
          element={
            <ProtectedRoute>
              <FavoritesPlaces />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/profile-settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ===== REDIRECT ===== */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* ===== 404===== */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default App
