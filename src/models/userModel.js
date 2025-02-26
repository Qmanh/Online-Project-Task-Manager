import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'

const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}
// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),

  userName: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['_id', 'emai', 'userName', 'createdAt']
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createdUser
  } catch (error) {
    throw new ApiError(StatusCodes.NOT_FOUND, error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}
const findOneByEmail = async (email) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: email })
  } catch (error) {
    throw new Error(error)
  }
}
const updateUserDetails = async (userId, updatedData) => {
  try {
    Object.keys(updatedData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updatedData[fieldName]
      }
    })
    if (updatedData.columnId) {
      updatedData.columnId = new ObjectId(updatedData.columnId)
    }
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updatedData },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_ROLES,
  createNew,
  findOneById,
  findOneByEmail,
  updateUserDetails
}