/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (data) => {
  try {
    const existUser = await userModel.findOneByEmail(data.email)
    if (existUser) { throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!') }

    //lay du lieu name dung truoc @ cua email
    const nameFromEmail = data.email.split('@')[0]
    const newUser = {
      email: data.email,
      password: bcryptjs.hashSync(data.password, 8), //tham so 2 la do phuc tap, cang cao cang lau
      userName: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Please verify your email before using our services!'
    const htmlContent = `
      <h3>Here is your verification link: </h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/>'Trello Web - Admin dev'</h3>
    `
    //Goi provider gui mail
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}
const verifyAccount = async (data) => {
  try {
    const existUser = await userModel.findOneByEmail(data.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found...')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is already active...')
    if (existUser.verifyToken !== data.token) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid...')

    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.updateUserDetails(existUser._id, updateData)
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}
const loginAccount = async (data) => {
  try {
    const existUser = await userModel.findOneByEmail(data.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found...')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is not active...')
    if (!bcryptjs.compareSync(data.password, existUser.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email or Password is wrong...')

    //Tao JWT token gom _id, email cua User
    const userInfo = { _id: existUser._id, email: existUser.email }
    //Tao accessToken, refreshToken tra ve FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )
    //Tra thong tin user kem 2 token moi
    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) {
    throw error
  }
}
const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
    return { accessToken }
  } catch (error) {
    throw error
  }
}

const updateAccount = async (userId, data, userAvatarFile) => {
  try {
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found...')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account is unactive!')

    let updatedUser = {}
    //TH: change password
    if (data.current_password && data.new_password) {
      if (!bcryptjs.compareSync(data.current_password, existUser.password)) {

        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email or Password is wrong...')
      }
      updatedUser = await userModel.updateUserDetails(existUser._id, {
        password: bcryptjs.hashSync(data.new_password, 8)
      })
    } else if (userAvatarFile) {
      //TH upload file len cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users')

      //luu url(secure_url) cua file vao database
      updatedUser = await userModel.updateUserDetails(existUser._id, {
        avatar: uploadResult.secure_url
      })
    } else {
      //TH up date thong tin chung
      updatedUser = await userModel.updateUserDetails(existUser._id, data)
    }
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}
export const userService = {
  createNew, verifyAccount, loginAccount, refreshToken, updateAccount
}