import './PlaceGrid.css'
import { useState } from 'react'
import LikeButton from './LikeButton'
import PlaceCarousel from './PlaceCarousel'
import PlaceUpdateForm from '../components/forms/PlaceUpdateForm'
import StarRating from './StarRating'

function PlaceGrid({ places, stats, onOpenPlace, onDelete, onUpdate }) {
  const role = localStorage.getItem('Role')

  const [selectedPlace, setSelectedPlace] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  if (!places.length) {
    return <p style={{ padding: '2rem' }}>No places found.</p>
  }

  return (
    <div className="layoutWithSidebar">
      {/* HERO */}
      <div className="leftHero">
        <h1>
          Discover <br />
          new <br />
          places.
        </h1>
        <p>Explore amazing destinations.</p>
      </div>

      {/* GRID */}
      <section className="gridSection">
        {places.map((place, index) => {
          const placeName = place.name

          return (
            <div
              key={placeName}
              className={`rowCard ${index % 2 !== 0 ? 'reverse' : ''}`}
            >
              {/* IMAGE */}
              <div className="imageBlock">
                <PlaceCarousel
                  images={place.picturesPlace || []}
                  onClick={() => onOpenPlace(placeName)}
                />

                <div className="titleOverlay">
                  <h3 onClick={() => onOpenPlace(placeName)}>{placeName}</h3>
                </div>

                <div className="likeButtonWrapper">
                  <LikeButton places={place} isFavorite={place.isFavorite} />
                </div>

                {role === 'ROLE_ADMIN' && (
                  <div className="adminButtons">
                    <button onClick={() => setSelectedPlace(place)}>✎</button>
                    <button
                      className="delete"
                      onClick={() => setConfirmDelete(placeName)}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* TEXT */}
              <div className="textBlock">
                <div className="place-rating">
                  <h2>{placeName}</h2>

                  <StarRating
                    rating={Math.round(stats[placeName]?.average || 0)}
                    readonly
                    showNumbers={false}
                  />

                  <span className="rating-number">
                    {stats[placeName]?.average
                      ? stats[placeName].average.toFixed(1)
                      : '0.0'}
                  </span>
                </div>

                <p>Location: {place.location}</p>
                <p>Best time to visit: {place.bestTime}</p>
                <p>Category: {place.categoryName}</p>
                <p>Comments count: {stats[placeName]?.count ?? 0}</p>
              </div>
            </div>
          )
        })}
      </section>

      {/* DELETE MODAL GLOBAL */}
      {confirmDelete && (
        <div className="deleteConfirm">
          <div className="deleteBox">
            <p>Delete "{confirmDelete}"?</p>

            <div className="deleteActions">
              <button
                className="btnYes"
                onClick={() => onDelete(confirmDelete)}
              >
                Yes
              </button>

              <button
                className="btnCancel"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {selectedPlace && (
        <PlaceUpdateForm
          place={selectedPlace}
          closeModal={() => setSelectedPlace(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  )
}

export default PlaceGrid
