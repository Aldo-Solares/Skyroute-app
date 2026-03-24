import { useEffect, useState } from 'react'
import './HomePage.css'

import HomeGrid from '../components/HomeGrid'
import HomeSearchModal from '../components/modals/HomeSearchModal'
import CategoryUpdateForm from '../components/forms/CategoryUpdateForm'

import { getCategoriesRequest } from '../services/CategoryService'
import { getAllPlaces } from '../services/PlaceService'

function HomePage() {
  const [category, setCategory] = useState([])
  const [places, setPlaces] = useState([])

  const [search, setSearch] = useState('')
  const [filteredResults, setFilteredResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    getCategoriesRequest().then(setCategory).catch(console.error)
    getAllPlaces().then(setPlaces).catch(console.error)
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)

    if (!value) {
      setFilteredResults([])
      setShowResults(false)
      return
    }

    const query = value.toLowerCase()

    const categoryResults = category.filter((cat) =>
      (cat.categoryName ?? '').toLowerCase().includes(query),
    )

    const placeResults = places.filter((p) =>
      (p.name ?? '').toLowerCase().includes(query),
    )

    setFilteredResults([
      ...categoryResults.map((c) => ({
        type: 'category',
        name: c.categoryName,
        item: c,
      })),
      ...placeResults.map((p) => ({
        type: 'place',
        name: p.name,
        item: p,
      })),
    ])

    setShowResults(true)
  }

  const handleCategoryUpdated = (updatedCategory) => {
    setCategory((prev) =>
      prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)),
    )
    setEditingCategory(null)
  }

  return (
    <div className="home-page">
      {/* ================= HEADER ================= */}
      <section className="home-page-header">
        <img
          src="/images/HomeImage.jpg"
          alt="Imagen principal de la página de inicio"
          loading="lazy"
        />

        <div className="home-page-overlay">
          <div className="home-page-text">
            <h1>Travel around the world</h1>
            <p>Discover your next destination</p>
          </div>

          <button
            className="open-search-btn"
            onClick={() => setIsSearchOpen(true)}
          >
            Search categories
          </button>
        </div>
      </section>

      <div className="home-page-curve" />

      {/* ================= GRID ================= */}
      <HomeGrid category={category} onEditCategory={setEditingCategory} />

      {/* ================= SEARCH MODAL ================= */}
      <HomeSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        search={search}
        onSearch={handleSearch}
        results={filteredResults}
        showResults={showResults}
      />

      {/* ================= UPDATE MODAL ================= */}
      {editingCategory && (
        <CategoryUpdateForm
          category={editingCategory}
          closeModal={() => setEditingCategory(null)}
          onUpdated={handleCategoryUpdated}
        />
      )}
    </div>
  )
}

export default HomePage
