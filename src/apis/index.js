import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'

/**Boards */

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return res.data
}
export const moveCardToDifferentColumnAPI = async (updateData) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return res.data
}
export const createNewBoardAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
  toast.success(`${data?.title} was created successfully!`)
  return res.data
}

/**Columns */
export const createNewColumnAPI = async (columnData) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, columnData)
  return res.data
}
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return res.data
}
export const deleteColumnDetailsAPI = async (columnId) => {
  const res = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return res.data
}
/**Cards */
export const createNewCardAPI = async (cardData) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, cardData)
  return res.data
}

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
  return res.data
}

/**Users */
export const registerUserAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully!  Please check an verify your account before logging in!', { theme: 'colored' })
  return res.data
}

export const verifyUserAPI = async (data) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return res.data
}

export const refreshTokenAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh-token`)
  return res.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return res.data
}

// invite user to join board
export const inviteUserToBoardAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
  toast.success(`${data.inviteEmail} was invited to board successfully!`)
  return res.data
}