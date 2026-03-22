import './StarRating.css'

function StarRating({
  rating,
  setRating,
  readonly = false,
  showNumbers = true,
}) {
  return (
    <div className="rating" data-rating={rating}>
      {[1, 2, 3, 4, 5].map((value) => (
        <div
          key={value}
          className={`star ${rating >= value ? 'active' : ''}`}
          onClick={() => !readonly && setRating(value)}
        >
          <svg viewBox="0 0 24 24" width="35" height="35">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>

          <div className="ombre"></div>

          {showNumbers && <span className="star-number">{value}</span>}
        </div>
      ))}
    </div>
  )
}

export default StarRating
