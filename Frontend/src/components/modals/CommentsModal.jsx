import { useEffect, useState, useCallback } from 'react'
import {
  getCommentsByPlace,
  createComment,
  deleteComment,
  updateComment,
} from '../../services/CommentService'
import { getUser } from '../../storage/StorageService'
import StarRating from '../StarRating'
import './CommentsModal.css'

const IMG_BASE = import.meta.env.VITE_IMG_URL

export default function PlaceModal({ isOpen, placeName, onClose }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [text, setText] = useState('')
  const [rate, setRate] = useState(5)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  const [editingId, setEditingId] = useState(null)
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
    } finally {
      setLoading(false)
    }
  }, [placeName])

  useEffect(() => {
    if (isOpen) {
      loadComments()
      setShowForm(false)
    }
  }, [isOpen, loadComments])

  const handleFiles = (e, setF, setP) => {
    const list = Array.from(e.target.files)
    setF(list)
    setP(list.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setSending(true)
    try {
      await createComment({
        text,
        rate,
        date: new Date().toISOString(),
        userName: currentUser || 'Anonymous',
        placeName,
        files,
      })

      setText('')
      setRate(5)
      setFiles([])
      setPreviews([])
      setShowForm(false)
      loadComments()
    } catch {
      setError('Error sending comment')
    } finally {
      setSending(false)
    }
  }

  const startEdit = (c) => {
    setEditingId(c.id)
    setEditText(c.text)
    setEditRate(c.rate)
    setEditFiles([])
    setEditPreviews([])
  }

  const saveEdit = async (c) => {
    try {
      await updateComment({
        oldComment: {
          text: c.text,
          rate: c.rate,
          date: c.date,
        },
        newComment: {
          text: editText,
          rate: editRate,
          date: new Date().toISOString(),
        },
        placeName,
        files: editFiles,
      })

      setEditingId(null)
      loadComments()
    } catch {
      setError('Error updating comment')
    }
  }

  const handleDelete = async (c) => {
    try {
      await deleteComment({
        text: c.text,
        rate: c.rate,
        date: c.date,
        placeName,
      })
      loadComments()
    } catch {
      setError('Error deleting comment')
    }
  }

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
          {comments.map((c) => {
            const userImg =
              c.user?.imgPath &&
              c.user.imgPath !== 'null' &&
              c.user.imgPath !== 'undefined'
                ? `${IMG_BASE}/uploads/users/${c.user.imgPath}`
                : null

            return (
              <article key={c.id} className="cmt-card">
                <div className="cmt-top">
                  <div className="cmt-user">
                    {userImg ? (
                      <img src={userImg} className="cmt-user-img" />
                    ) : (
                      <div className="cmt-user-img initials">
                        {(c.user?.username || 'U')[0]}
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

                  <StarRating rating={c.rate} readonly showNumbers={false} />
                </div>

                <p className="cmt-text">{c.text}</p>

                {Array.isArray(c.picComms) && c.picComms.length > 0 && (
                  <div className="cmt-images">
                    {c.picComms.map((img, i) => (
                      <img
                        key={i}
                        src={`${IMG_BASE}/uploads/comments/${img.path}`}
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    ))}
                  </div>
                )}

                {c.user?.username === currentUser && (
                  <div className="cmt-actions">
                    <button className="cmt-edit" onClick={() => startEdit(c)}>
                      Edit
                    </button>
                    <button
                      className="cmt-delete"
                      onClick={() => handleDelete(c)}
                    >
                      Delete
                    </button>
                  </div>
                )}

                {editingId === c.id && (
                  <div className="cmt-edit-box">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />

                    <StarRating rating={editRate} setRating={setEditRate} />

                    <div className="pm-file">
                      <label htmlFor={`edit-images-${c.id}`}>
                        <span>Choose images</span>
                      </label>
                      <input
                        id={`edit-images-${c.id}`}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          handleFiles(e, setEditFiles, setEditPreviews)
                        }
                      />
                    </div>

                    <div className="pm-preview">
                      {editPreviews.map((src, i) => (
                        <img key={i} src={src} />
                      ))}
                    </div>

                    <div className="cmt-edit-actions">
                      <button onClick={() => saveEdit(c)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
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
          <form className="pm-form" onSubmit={handleSubmit}>
            <StarRating rating={rate} setRating={setRate} />

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
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
                onChange={(e) => handleFiles(e, setFiles, setPreviews)}
              />
            </div>

            <div className="pm-preview">
              {previews.map((src, i) => (
                <img key={i} src={src} />
              ))}
            </div>

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
