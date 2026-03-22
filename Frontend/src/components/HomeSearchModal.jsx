import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomeSearchModal.css";

function HomeSearchModal({
  isOpen,
  onClose,
  search,
  onSearch,
  results,
  showResults,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="home-search-modal-backdrop" onClick={onClose}>
      <div className="home-search-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="home-search-modal-header">
          <h2>Search</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Search box */}
        <div className="home-search-modal-box">
          <input
            autoFocus
            type="text"
            placeholder="Search a Landscape"
            value={search}
            onChange={onSearch}
          />

          {showResults && (
            <ul className="home-search-modal-results">
              {results.length > 0 ? (
                results.map((res, index) => (
                  <li key={index} onClick={onClose}>
                    <Link to={`/category/${res.item.categoryName}`}>
                      {res.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No results found</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeSearchModal;
