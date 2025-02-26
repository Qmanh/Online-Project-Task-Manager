import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  //lay accessToken tu FE gui len
  const accessToken = req.cookies?.accessToken

  if (!accessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!(Token is invalid)'))
    return
  }

  try {

    //B1: Giai ma token co hop le khong
    const accessTokenDecoded = await JwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    // console.log('🚀 ~ isAuthorized ~ accessTokenDecoded:', accessTokenDecoded)
    //B2: Neu hop le, luu thong tin da giai ma vao req.jwtDecoded, su dung cho tang xu ly
    req.jwtDecoded = accessTokenDecoded
    //B3: Cho phep request di tiep
    next()

  } catch (error) {
    //accessToken het han thi tra ve mot ma loi GONE-410 cho phia FE biet de goi refresh token
    // console.log('error: ', error)
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized...'))
    //accessToken khong hop le vi bat ke loi khac 410 thi tra ve 401 de FE logout
  }
}

export const authMiddleware = { isAuthorized }