import { useState } from "react";
import "./PlaceCarousel.css";

function PlaceCarousel({ images = [], onClick }) {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return <img src="/no-image.png" alt="No image" className="carouselImage" />;
  }

  const next = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="carouselContainer" onClick={onClick}>
      <img
        src={`${import.meta.env.VITE_IMG_URL}/uploads/places/${images[index].path}`}
        alt="Place"
        className="carouselImage"
      />

      {images.length > 1 && (
        <>
          <button className="carouselBtn left" onClick={prev}>
            ‹
          </button>
          <button className="carouselBtn right" onClick={next}>
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default PlaceCarousel;
