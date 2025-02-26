/* eslint-disable no-useless-catch */
import JWT from 'jsonwebtoken'

const generateToken = async (userInfo, secrectSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secrectSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secrectSignature) => {
  try {
    return JWT.verify(token, secrectSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken, verifyToken
}