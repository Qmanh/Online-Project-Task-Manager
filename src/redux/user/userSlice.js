import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'


//Khoi tao gia tri cua mot cai slice trong redux
const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk(
  'activeBoard/loginUserAPI',
  async (data) => {
    const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return res.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const res = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully!')
    }
    return res.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return res.data
  }
)

//Khoi tao mot cai slice trong kho redux store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  //Reducers la noi xu ly du lieu dong bo
  reducers: {},
  //ExtraReducers: Noi xu ly du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      //action.payload o day chinh la response.data return trong func call api
      const user = action.payload
      state.currentUser = user
    })

    builder.addCase(logoutUserAPI.fulfilled, (state) => {

      state.currentUser = null
    })

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

//Actions: la noi de ca components su dung dispatch() de cap nhat du lieu tu redux
// export const {} = userSlice.actions

//Selectors: la noi danh cho components goi bang hook useSelector() de lay du lieu tu redux
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer