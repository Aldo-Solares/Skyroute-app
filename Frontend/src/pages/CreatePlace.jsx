import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPlace } from '../services/PlaceService'
import { getCategoriesRequest } from '../services/CategoryService'
import './CreatePlace.css'

function CreatePlace() {
  const { categoryName } = useParams()
  const navigate = useNavigate()

  const [category, setCategory] = useState(null)

  const [name, setName] = useState('')
  const [bestTime, setBestTime] = useState('')
  const [location, setLocation] = useState('')

  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const loadCategory = async () => {
      const categories = await getCategoriesRequest()
      const found = categories.find((c) => c.categoryName === categoryName)
      setCategory(found)
    }

    loadCategory()
  }, [categoryName])

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!files || files.length === 0) {
      setMessage('✨ Add an Image at least')
      setIsError(true)
      return
    }

    const placeData = {
      name,
      bestTime,
      location,
      picturesPlace: [],
      categoryName,
    }

    try {
      await createPlace(placeData, files, categoryName)
      navigate(`/category/${categoryName}`)
    } catch (e) {
      const message = e.response?.data || 'Error updating category'
      setMessage(message)
      setIsError(true)
    }
  }

  const bgStyle = category?.imagePath
    ? {
        '--bg-category': `url(${import.meta.env.VITE_IMG_URL}/uploads/categories/${category.imagePath})`,
      }
    : {}

  return (
    <div className="CreatePlace-Page" style={bgStyle}>
      <div className="CreatePlace-Container">
        <form className="CreatePlace-Form" onSubmit={handleSubmit}>
          <h2>Create Place</h2>

          {/* PREVIEW */}
          {previews.length > 0 && (
            <div className="place-image-preview">
              {previews.map((src, i) => (
                <img key={i} src={src} alt="preview" />
              ))}
            </div>
          )}

          <div className="place-input-group">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="place-input-group">
            <label>Best time</label>
            <textarea
              rows="3"
              value={bestTime}
              onChange={(e) => setBestTime(e.target.value)}
              required
            />
          </div>

          <div className="place-input-group">
            <label>Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="place-input-group">
            <label>Category</label>
            <input value={categoryName} disabled />
          </div>

          <div className="custom-file">
            <label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
              />
              <span>Select images</span>
            </label>
          </div>

          {/* MESSAGE */}
          {message && (
            <p
              className={
                isError
                  ? 'create-place-message error'
                  : 'create-place-message success'
              }
            >
              {message}
            </p>
          )}

          <button type="submit">Create Place</button>
        </form>
      </div>
    </div>
  )
}

export default CreatePlace
