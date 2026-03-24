import api from '../api/AxiosConfig'

import { getUser } from '../storage/StorageService'

export const createPlace = async (placeData, files, categoryName) => {
  const formData = new FormData()

  formData.append(
    'placeData',
    new Blob([JSON.stringify(placeData)], { type: 'application/json' })
  )

  if (Array.isArray(files) && files.length > 0) {
    files.forEach(file => formData.append('files', file))
  }

  formData.append('categoryName', categoryName)

  const { data } = await api.post('/places', formData)

  return data
}

export const updatePlace = async (
  placeData,
  files,
  categoryName,
  originalName
) => {
  const formData = new FormData()

  formData.append(
    'placeData',
    new Blob([JSON.stringify(placeData)], { type: 'application/json' })
  )

  if (Array.isArray(files) && files.length > 0) {
    files.forEach(file => formData.append('files', file))
  }

  formData.append('categoryName', categoryName)
  formData.append('originalName', originalName)

  const { data } = await api.put('/places', formData)

  return data
}

export const getAllPlaces = async () => {
  const { data } = await api.get('/places')
  return data
}

export const getPlacesByCategory = async categoryName => {
  const userName = getUser()

  if (!userName) {
    throw new Error('User not found')
  }

  const { data } = await api.get(
    `/places/category/${encodeURIComponent(categoryName)}/user/${encodeURIComponent(userName)}`
  )

  return data
}

export const deletePlace = async placeName => {
  await api.delete(`/places/${encodeURIComponent(placeName)}`)
}

export const getCommentsStats = async placeName => {
  const { data } = await api.get(
    `/comments/stats/${encodeURIComponent(placeName)}`
  )
  return data
}
