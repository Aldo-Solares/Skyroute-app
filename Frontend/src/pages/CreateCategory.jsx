import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCategoryRequest } from '../services/CategoryService'
import './CreateCategory.css'

function CreateCategory() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImage(file)

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)

    // Limpia mensaje si ya había error
    setMessage('')
    setIsError(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!image) {
      setMessage('✨ Add an Image')
      setIsError(true)
      return
    }

    try {
      await createCategoryRequest({
        name,
        description,
        image,
      })

      navigate('/home')
    } catch (e) {
      const message = e.response?.data || 'Error updating category'
      setMessage(message)
      setIsError(true)
    }
  }

  return (
    <div className="CreateCategory-Page">
      <div className="CreateCategory-Container">
        <form className="CreateCategory-Form" onSubmit={handleSubmit}>
          <h2>Create Category</h2>

          {/* IMAGE PREVIEW */}
          {imagePreview && (
            <div className="category-image-preview">
              <img src={imagePreview} alt="preview" />
            </div>
          )}

          {/* NAME */}
          <div className="category-input-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Category name"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="category-input-group">
            <label>Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Category description"
            />
          </div>

          {/* FILE */}
          <div className="custom-file">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <span>Select image</span>
            </label>
          </div>

          {/* MESSAGE */}
          {message && (
            <p
              className={
                isError
                  ? 'create-category-message error'
                  : 'create-category-message success'
              }
            >
              {message}
            </p>
          )}

          {/* BUTTON */}
          <button type="submit">Create Category</button>
        </form>
      </div>
    </div>
  )
}

export default CreateCategory
