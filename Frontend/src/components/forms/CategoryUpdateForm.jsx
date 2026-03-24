import { useState } from 'react'
import { updateCategoryRequest } from '../../services/CategoryService'
import './CategoryUpdateForm.css'

function CategoryUpdateForm({ category, closeModal }) {
  const [name, setName] = useState(category.categoryName)
  const [description, setDescription] = useState(category.description)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()

    try {
      const data = {
        categoryName: name,
        description,
        ...(file && { image: file }),
      }

      await updateCategoryRequest(category.categoryName, data)

      setMessage('Category updated successfully')
      setIsError(false)

      setTimeout(() => {
        window.location.reload()
      }, 800)
    } catch (e) {
      const message = e.response?.data || 'Error updating category'
      setMessage(message)
      setIsError(true)
    }
  }

  return (
    <div className="update-category-overlay">
      <div className="update-category-modal">
        <h2>Edit Category</h2>

        <form onSubmit={handleUpdateCategory}>
          {/* IMAGE PREVIEW */}
          <div className="update-category-image-preview">
            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              category.imagePath && (
                <img
                  src={`${import.meta.env.VITE_IMG_URL}/uploads/categories/${category.imagePath}`}
                  alt="category"
                />
              )
            )}
          </div>

          {/* MESSAGE */}
          {message && (
            <p
              className={
                isError ? 'update-category-error' : 'update-category-success'
              }
            >
              {message}
            </p>
          )}

          {/* NAME */}
          <div className="update-category-input-group">
            <label>Category name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="update-category-input-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* FILE */}
          <div className="update-category-input-group">
            <label>Image</label>

            <div className="update-category-file">
              <label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <span>{file ? file.name : 'Select image'}</span>
              </label>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="update-category-buttons">
            <button type="submit">Update Category</button>

            <button
              type="button"
              className="update-category-cancel"
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

export default CategoryUpdateForm
