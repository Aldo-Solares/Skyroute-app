import { useEffect, useState } from 'react'
import { getUserFavoritePlaces } from '../services/LikeService'
import { useNavigate } from 'react-router-dom'
import LikeButton from '../components/LikeButton'
import './FavoritesPlaces.css'

function FavoritesPlaces() {
  const [places, setPlaces] = useState([])
  const currentUser = localStorage.getItem('User')
  const navigate = useNavigate()
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getUserFavoritePlaces(currentUser)
        setPlaces(data)
      } catch (err) {
        console.error('Error loading favorites', err)
      }
    }

    fetchFavorites()
  }, [currentUser])

  if (!places.length) {
    return (
      <div className="favoritesPage">
        <h1 className="favoritesEmpty">
          No favorites yet
          <br />
          Start exploring and add some!
        </h1>
      </div>
    )
  }

  return (
    <div className="favoritesPage">
      <h2 className="favoritesTitle">Your favorite places</h2>

      <section className="favoritesGrid">
        {places.map((place, index) => (
          <div key={place.name + index} className="favoriteCard">
            <div className="favoriteImageWrapper">
              <img
                src={`${import.meta.env.VITE_IMG_URL}/uploads/places/${place.picturesPlace[0]?.path}`}
                alt={place.name}
                className="favoriteImage"
                onClick={() => navigate(`/category/${place.categoryName}`)}
              />

              <div className="favoriteLike">
                <LikeButton places={place} isFavorite={true} />
              </div>

              <div className="favoriteOverlay">
                <h3>{place.name}</h3>
                <p>{place.location}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default FavoritesPlaces
