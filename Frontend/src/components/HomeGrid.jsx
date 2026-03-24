import { useState } from 'react'
import './HomeGrid.css'
import { Link } from 'react-router-dom'
import CategoryForm from '../components/forms/CategoryUpdateForm'
import { deleteCategoryRequest } from '../services/CategoryService'

function HomeGrid({ category = [] }) {
  const role = localStorage.getItem('Role')

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const handleDelete = async (name) => {
    try {
      await deleteCategoryRequest(name)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="layoutWithSidebar">
      <div className="leftHero">
        <h1>
          Travel
          <br />
          your
          <br />
          way.
        </h1>
        <p>
          Looking for inspiration?
          <br />
          Discover our highlights.
        </p>
      </div>

      <section className="gridSection">
        {category.map((cat, index) => (
          <div
            key={cat.categoryName}
            className={`rowCard ${index % 2 !== 0 ? 'reverse' : ''}`}
          >
            {/* IMAGE */}
            <div className="imageBlock">
              <Link to={`/category/${cat.categoryName}`}>
                <img
                  src={`${import.meta.env.VITE_IMG_URL}/uploads/categories/${cat.imagePath}`}
                  alt={cat.categoryName}
                />
              </Link>

              <div className="titleOverlay">
                <h3>{cat.categoryName}</h3>
              </div>

              {role === 'ROLE_ADMIN' && (
                <div className="adminButtons">
                  <button onClick={() => setSelectedCategory(cat)}>✎</button>
                  <button
                    className="delete"
                    onClick={() => setConfirmDelete(cat.categoryName)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* TEXT */}
            <div className="textBlockH">
              <h3>{cat.categoryName}</h3>
              <p>{cat.description}</p>

              <Link to={`/category/${cat.categoryName}`} className="cta">
                {index % 2 !== 0 ? '← Explore' : 'Explore →'}
              </Link>
            </div>

            {/* DELETE MODAL */}
            {confirmDelete === cat.categoryName && (
              <div className="deleteConfirm">
                <div className="deleteBox">
                  <p>Delete "{cat.categoryName}"?</p>

                  <div className="deleteActions">
                    <button
                      className="btnYes"
                      onClick={() => handleDelete(cat.categoryName)}
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
          </div>
        ))}

        {selectedCategory && (
          <CategoryForm
            category={selectedCategory}
            closeModal={() => setSelectedCategory(null)}
          />
        )}
      </section>
    </div>
  )
}

export default HomeGrid
