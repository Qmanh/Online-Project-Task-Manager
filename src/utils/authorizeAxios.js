import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

let axiosReduxStore

export const injectStore = mainStore => { axiosReduxStore = mainStore }

//custome va cau hinh chung api
let authorizedAxiosInstance = axios.create()

//toi da 1 request - 10 phut
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

//withCredentials: cho phep axios tu dong gui cookie moi lan request len BE (luu JWT tokens)
authorizedAxiosInstance.defaults.withCredentials = true

//add a request interceptor
authorizedAxiosInstance.interceptors.request.use((config) => {
  //ky thuat chan spam click
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

let refreshTokenPromise = null

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
  //ky thuat chan spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  //ky thuat chan spam click
  interceptorLoadingElements(false)

  /**Xu ly refresh token tu dong */
  //TH1: nhan ma 401 tu BE -> dang xuat luon
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }
  //TH2: nhan ma 410 tu BE
  const originalRequest = error.config
  if (error.response?.status === 410 && !originalRequest._retry) {
    originalRequest._retry = true

    //Kiem tra neu chua co refreshTokenPromise thi thuc hien viec goi api  refresh token dong thoi gan vao refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          //dong thoi accessToken da nam trong httpOnly cookie(xu ly o BE)
          return data?.accessToken
        })
        .catch(() => {
          //Neu nhan bat ki loi nao tu api refresh token thi logout
          axiosReduxStore.dispatch(logoutUserAPI(false))
        })
        .finally(() => {
          //API co ok hay loi thi van gan lai refreshTokenPromise ve null
          refreshTokenPromise = null
        })
    }

    //can return truong hop refreshTokenPromise thanh cong
    return refreshTokenPromise.then(accessToken => {
      /**
       * Buoc 1: truong hop can luu accessToken vao localStorage hoac cho khac thi viet them code
       * vi du: axios.defaults.headers.common['Authorization'] ='Bearer ' + accessToken
       * Hien tai khong can vi accessToken duoc luu vao cookie (xu ly o BE)
       */

      //Buoc2: return lai axios instance ket hop cac originalRequest de goi lai api ban dau bi loi
      return authorizedAxiosInstance(originalRequest)
    })
  }

  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  //hien thi bat ke moi ma loi (ngoai tru 410 - tu dong refresh token)
  if (error.response.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})
export default authorizedAxiosInstance