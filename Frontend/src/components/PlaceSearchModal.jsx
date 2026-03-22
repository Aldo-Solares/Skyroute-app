import { useEffect, useState } from "react";
import "./PlaceSearchModal.css";
import { getPlacesByCategory } from "../services/PlaceService";

function PlaceSearchModal({ isOpen, onClose, categoryName, setOpenPlace }) {
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPlaces = async () => {
      try {
        const data = await getPlacesByCategory(categoryName);
        setPlaces(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [isOpen, categoryName]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value) {
      setFilteredResults([]);
      setShowResults(false);
      return;
    }

    const results = places.filter((p) =>
      p.name.toLowerCase().startsWith(value.toLowerCase()),
    );

    setFilteredResults(results);
    setShowResults(true);
  };

  if (!isOpen) return null;

  return (
    <div className="place-search-modal-backdrop" onClick={onClose}>
      <div className="place-search-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="place-search-modal-header">
          <h2>Search places</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* SEARCH */}
        <div className="place-search-modal-box">
          <input
            autoFocus
            type="text"
            placeholder="Search a Place"
            value={search}
            onChange={handleSearch}
          />

          {showResults && (
            <ul className="place-search-modal-results">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => {
                      setOpenPlace(item.name);
                      onClose();
                    }}
                  >
                    {item.name}
                  </li>
                ))
              ) : (
                <li>No results found</li>
              )}
            </ul>
          )}
        </div>

        {loading && <p style={{ marginTop: 16 }}>Loading places…</p>}
      </div>
    </div>
  );
}

export default PlaceSearchModal;
