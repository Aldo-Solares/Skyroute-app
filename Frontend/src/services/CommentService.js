import api from '../api/AxiosConfig'

export const createComment = async ({
  text,
  rate,
  date,
  userName,
  placeName,
  files = []
}) => {
  const formData = new FormData()

  formData.append(
    'commentData',
    new Blob([JSON.stringify({ text, rate, date })], {
      type: 'application/json'
    })
  )

  formData.append('userName', userName)
  formData.append('placeName', placeName)

  if (files?.length) {
    files.forEach(file => {
      formData.append('files', file)
    })
  }

  const { data } = await api.post('/comments', formData, {})

  return data
}

export const getCommentsByPlace = async placeName => {
  const { data } = await api.get(
    `/comments/place/${encodeURIComponent(placeName)}`
  )
  return data
}

export const deleteComment = async ({ text, rate, date, placeName }) => {
  const formData = new FormData()

  formData.append(
    'commentData',
    new Blob([JSON.stringify({ text, rate, date })], {
      type: 'application/json'
    })
  )

  formData.append('placeName', placeName)

  const { data } = await api.delete('/comments', {
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data
}

export const updateComment = async ({
  oldComment,
  newComment,
  placeName,
  files
}) => {
  const formData = new FormData()

  formData.append(
    'commentData',
    new Blob([JSON.stringify(oldComment)], {
      type: 'application/json'
    })
  )

  formData.append(
    'newCommentData',
    new Blob([JSON.stringify(newComment)], {
      type: 'application/json'
    })
  )

  formData.append('placeName', placeName)

  if (files && files.length > 0) {
    files.forEach(file => {
      formData.append('images', file)
    })
  }

  const { data } = await api.put('/comments', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data
}
