import { useState, useEffect } from 'react'
import { updatePlace } from '../../services/PlaceService'
import './PlaceUpdateForm.css'

function PlaceUpdateForm({ place, closeModal, onUpdate }) {
  const [name, setName] = useState(place.name)
  const [location, setLocation] = useState(place.location)
  const [bestTime, setBestTime] = useState(place.bestTime)

  const [files, setFiles] = useState([])
  const [preview, setPreview] = useState(null)

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const setFeedback = (msg, error = false) => {
    setMessage(msg)
    setIsError(error)
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (!selectedFiles.length) return

    setFiles(selectedFiles)
    setPreview(URL.createObjectURL(selectedFiles[0]))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      const placeData = {
        name,
        location,
        bestTime,
      }

      await updatePlace(
        placeData,
        files.length ? files : null,
        place.categoryName,
        place.name,
      )

      setFeedback('Place updated successfully', false)

      setTimeout(() => {
        if (onUpdate) onUpdate()
        closeModal()
      }, 600)
    } catch (e) {
      const errorMsg = e.response?.data || 'Unexpected error'
      setFeedback(errorMsg, true)
    }
  }

  return (
    <div className="update-place-overlay">
      <div className="update-place-modal">
        <h2>Edit Place</h2>

        <form onSubmit={handleUpdate}>
          {/* IMAGE PREVIEW */}
          <div className="update-place-image-preview">
            {preview ? (
              <img src={preview} alt="preview" />
            ) : place.picturesPlace?.length > 0 ? (
              <img
                src={`${import.meta.env.VITE_IMG_URL}/uploads/places/${place.picturesPlace[0]?.path}`}
                alt="place"
              />
            ) : (
              <p>No image</p>
            )}
          </div>

          {/* WARNING */}
          {files.length > 0 && (
            <p className="update-place-warning">
              Existing images will be replaced
            </p>
          )}

          {/* MESSAGE */}
          {message && (
            <div className="update-place-message-wrapper">
              <p
                className={
                  isError ? 'update-place-error' : 'update-place-success'
                }
              >
                {message}
              </p>
            </div>
          )}

          {/* NAME */}
          <div className="update-place-input-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* LOCATION */}
          <div className="update-place-input-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* BEST TIME */}
          <div className="update-place-input-group">
            <label>Best time</label>
            <input
              type="text"
              value={bestTime}
              onChange={(e) => setBestTime(e.target.value)}
              required
            />
          </div>

          {/* FILE INPUT */}
          <div className="update-place-input-group">
            <label>Images</label>

            <div className="update-place-file">
              <label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <span>
                  {files.length
                    ? `${files.length} file(s) selected`
                    : 'Select images'}
                </span>
              </label>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="update-place-buttons">
            <button type="submit">Update Place</button>

            <button
              type="button"
              className="update-place-cancel"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlaceUpdateForm
