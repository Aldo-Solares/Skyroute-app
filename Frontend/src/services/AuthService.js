import api from '../api/AxiosConfig'

export const loginRequest = async ({ username, password }) => {
  const { data } = await api.post('/auth/login', { username, password })
  return data
}

export const registerRequest = async ({ username, password }) => {
  const { data } = await api.post('/auth/register', {
    username,
    password
  })

  return data
}
