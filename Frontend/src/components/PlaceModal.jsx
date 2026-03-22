import { useEffect, useState, useCallback } from 'react'
import {
  getCommentsByPlace,
  createComment,
  deleteComment,
  updateComment,
} from '../services/CommentService'
import { getUser } from '../storage/StorageService'
import StarRating from '../components/StarRating'
import './PlaceModal.css'

const IMG_BASE = import.meta.env.VITE_IMG_URL

export default function PlaceModal({ isOpen, placeName, onClose }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [text, setText] = useState('')
  const [rate, setRate] = useState(5)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState('')
  const [editRate, setEditRate] = useState(5)
  const [editFiles, setEditFiles] = useState([])
  const [editPreviews, setEditPreviews] = useState([])

  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const currentUser = getUser()

  const loadComments = useCallback(async () => {
    if (!placeName) return

    setLoading(true)
    try {
      const data = await getCommentsByPlace(placeName)
      setComments(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [placeName])

  useEffect(() => {
    if (!isOpen) return
    loadComments()
    setShowForm(false)
  }, [isOpen, loadComments])

  const handleDeleteComment = async (comment) => {
    try {
      await deleteComment({
        text: comment.text,
        rate: comment.rate,
        date: comment.date,
        placeName,
        userName: comment.user?.username,
      })
      await loadComments()
    } catch (err) {
      console.error(err)
      setError('Error deleting comment')
    }
  }

  const handleEditClick = (comment) => {
    setEditingComment(comment)
    setEditText(comment.text)
    setEditRate(comment.rate)
    setEditFiles([])
    setEditPreviews([])
  }

  const handleUpdateComment = async () => {
    try {
      await updateComment({
        oldComment: {
          text: editingComment.text,
          rate: editingComment.rate,
          date: editingComment.date,
        },
        newComment: {
          text: editText,
          rate: editRate,
          date: new Date().toISOString(),
        },
        placeName,
        files: editFiles,
      })

      setEditingComment(null)
      setEditFiles([])
      setEditPreviews([])

      await loadComments()
    } catch (err) {
      console.error(err)
      setError('Error updating comment')
    }
  }

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files)
    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  const handleEditFilesChange = (e) => {
    const selected = Array.from(e.target.files)
    setEditFiles(selected)
    setEditPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setSending(true)
    setError(null)

    try {
      await createComment({
        text,
        rate,
        date: new Date().toISOString(),
        userName: currentUser || 'Anonymous',
        placeName,
        files,
      })

      await loadComments()

      setText('')
      setRate(5)
      setFiles([])
      setPreviews([])
      setShowForm(false)
    } catch (err) {
      console.error(err)
      setError('Error sending comment')
    } finally {
      setSending(false)
    }
  }

  const getInitials = (name = 'U') =>
    name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

  if (!isOpen) return null

  return (
    <div className="pm-backdrop" onClick={onClose}>
      <div className="pm-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="pm-close" onClick={onClose}>
          ✕
        </button>

        <h2>Comments for {placeName}</h2>

        {loading && <p>Loading comments…</p>}
        {!loading && !comments.length && <p>No comments yet</p>}

        <div className="comments-container">
          {comments.map((c, index) => {
            const key = c.id ?? `${c.user?.username}-${c.date}-${index}`
            const inputId = `edit-images-${index}`
            const userImg =
              c.user?.imgPath &&
              c.user.imgPath !== 'null' &&
              c.user.imgPath !== 'undefined'
                ? `${IMG_BASE}/uploads/users/${c.user.imgPath}`
                : null

            return (
              <article key={key} className="cmt-card">
                <div className="cmt-top">
                  <div className="cmt-user">
                    {userImg ? (
                      <img src={userImg} className="cmt-user-img" />
                    ) : (
                      <div className="cmt-user-img initials">
                        {getInitials(c.user?.username)}
                      </div>
                    )}

                    <div className="cmt-user-info">
                      <span className="cmt-username">
                        {c.user?.username || 'Anonymous'}
                      </span>
                      <span className="cmt-date">
                        {new Date(c.date).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </div>

                  <div className="cmt-rating">
                    <StarRating rating={c.rate} readonly showNumbers={false} />
                  </div>
                </div>

                <p className="cmt-text">{c.text}</p>

                {c.picComms?.length > 0 && (
                  <div className="cmt-images">
                    {c.picComms.map((img) => (
                      <img
                        key={img.path}
                        src={`${IMG_BASE}/uploads/comments/${img.path}`}
                      />
                    ))}
                  </div>
                )}

                {c.user?.username === currentUser && (
                  <div className="cmt-actions">
                    <button
                      className="cmt-edit"
                      onClick={() => handleEditClick(c)}
                    >
                      Edit
                    </button>

                    <button
                      className="cmt-delete"
                      onClick={() => handleDeleteComment(c)}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {editingComment === c && (
                  <div className="cmt-edit-box">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />

                    <StarRating rating={editRate} setRating={setEditRate} />

                    <div className="pm-file">
                      <label htmlFor={inputId}>
                        <span>Choose images</span>
                      </label>
                      <input
                        id={inputId}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleEditFilesChange}
                      />
                    </div>

                    {editPreviews.length > 0 && (
                      <div className="pm-preview">
                        {editPreviews.map((src, i) => (
                          <img key={i} src={src} />
                        ))}
                      </div>
                    )}

                    <div className="cmt-edit-actions">
                      <button onClick={handleUpdateComment}>Save</button>
                      <button
                        onClick={() => {
                          setEditingComment(null)
                          setEditFiles([])
                          setEditPreviews([])
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {!showForm && (
          <button className="pm-addbtn" onClick={() => setShowForm(true)}>
            + Add comment
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="pm-form">
            <StarRating rating={rate} setRating={setRate} />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your comment…"
              required
            />

            <div className="pm-file">
              <label htmlFor="comment-images">
                <span>Choose images</span>
              </label>
              <input
                id="comment-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesChange}
              />
            </div>

            {previews.length > 0 && (
              <div className="pm-preview">
                {previews.map((src, i) => (
                  <img key={i} src={src} />
                ))}
              </div>
            )}

            <div className="pm-form-actions">
              <button type="submit" disabled={sending}>
                {sending ? 'Sending…' : 'Comment'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && <p className="pm-error">{error}</p>}
      </div>
    </div>
  )
}
