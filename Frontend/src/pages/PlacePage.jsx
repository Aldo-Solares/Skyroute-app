import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './PlacePage.css'

import PlaceGrid from '../components/PlaceGrid'
import PlaceModal from '../components/PlaceModal'
import PlaceSearchModal from '../components/PlaceSearchModal'

import {
  getAllPlaces,
  getPlacesByCategory,
  deletePlace,
  getCommentsStats,
} from '../services/PlaceService'
import { getCategoriesRequest } from '../services/CategoryService'

const IMG_BASE = import.meta.env.VITE_IMG_URL

function PlacePage() {
  const { categoryName } = useParams()

  const [places, setPlaces] = useState([])
  const [stats, setStats] = useState({})
  const [category, setCategory] = useState(null)
  const [openPlace, setOpenPlace] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // ✅ Places
        const placesData = categoryName
          ? await getPlacesByCategory(categoryName)
          : await getAllPlaces()

        const normalizedPlaces = placesData.map((p) => ({
          ...p,
          name: p.placeName ?? p.name,
          images: p.picturesPlace?.map(
            (img) => `${IMG_BASE}/uploads/places/${img.path}`,
          ),
        }))

        setPlaces(normalizedPlaces)

        // ✅ Stats
        const statsData = {}
        await Promise.all(
          normalizedPlaces.map(async (place) => {
            try {
              statsData[place.name] = await getCommentsStats(place.name)
            } catch {
              statsData[place.name] = { average: 0, count: 0 }
            }
          }),
        )
        setStats(statsData)

        // ✅ Category
        const categories = await getCategoriesRequest()
        const found = categories.find(
          (c) => c.categoryName.toLowerCase() === categoryName?.toLowerCase(),
        )

        if (found) {
          setCategory({
            name: found.categoryName,
            description: found.description,
            imageUrl: `${IMG_BASE}/uploads/categories/${found.imagePath}`,
          })
        }
      } catch (error) {
        console.error('Error loading place page:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [categoryName])

  const handleDelete = async (placeName) => {
    await deletePlace(placeName)
    setPlaces((prev) => prev.filter((p) => p.name !== placeName))
  }

  if (loading || !category) {
    return <div style={{ padding: 32 }}>Cargando…</div>
  }

  const reloadPlaces = () => {
    window.location.reload()
  }
  return (
    <div className="place-page">
      {/* HEADER */}
      <section className="place-page-header">
        <img src={category.imageUrl} alt={category.name} loading="lazy" />

        <div className="place-page-overlay">
          <div className="place-page-text">
            <h1>{category.name}</h1>
            <p>{category.description}</p>
          </div>

          <button
            className="open-search-btn"
            onClick={() => setIsSearchOpen(true)}
          >
            Buscar lugares
          </button>
        </div>
      </section>

      <div className="place-page-curve" />

      {/* GRID */}
      <PlaceGrid
        places={places}
        stats={stats}
        onOpenPlace={setOpenPlace}
        onDelete={handleDelete}
        onUpdate={reloadPlaces}
      />

      {/* MODALS */}
      <PlaceModal
        isOpen={Boolean(openPlace)}
        placeName={openPlace}
        onClose={() => setOpenPlace(null)}
      />

      <PlaceSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categoryName={categoryName}
        setOpenPlace={setOpenPlace}
      />
    </div>
  )
}

export default PlacePage
