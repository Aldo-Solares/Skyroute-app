import api from '../api/AxiosConfig'

export const updateUserProfile = async (originalUser, username, file) => {
  const formData = new FormData()

  formData.append('originalUsername', originalUser)
  formData.append('newUsername', username)

  if (file) {
    formData.append('img', file)
  }

  const { data } = await api.put('/auth/update', formData)

  return data
}

export const getUserInfo = async username => {
  const { data } = await api.get(`/auth/user/${username}`)
  return data
}

export const getUserImage = img => {
  if (!img) return null

  return `${import.meta.env.VITE_IMG_URL}/uploads/users/${img}`
}

export const changePassword = async (username, oldPassword, newPassword) => {
  const { data } = await api.put('/auth/change-password', {
    username,
    oldPassword,
    newPassword
  })

  return data
}
