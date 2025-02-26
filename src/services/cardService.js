/* eslint-disable no-useless-catch */

import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'


const createNew = async (data) => {
  try {
    const newCard = { ...data }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  } catch (error) {
    throw error
  }
}
const updateCardDetails = async (cardId, data, cardCoverFile, userInfo) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    let updatedCard = {}

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-cover')
      updatedCard = await cardModel.updateCardDetails(cardId, { cover: uploadResult.secure_url })
    } else if (updateData.commentToAdd) {
      const commentData = {
        ...updateData.commentToAdd,
        userId: userInfo._id,
        userEmail: userInfo.email,
        commentedAt: Date.now()
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else if (updateData.incomingMemberInfo) {
      updatedCard = await cardModel.updateMembers(cardId, updateData.incomingMemberInfo)
    } else {
      //TH up date thong tin chung
      updatedCard = await cardModel.updateCardDetails(cardId, updateData)
    }
    return updatedCard
  } catch (error) {
    throw error
  }
}
export const cardService = {
  createNew, updateCardDetails
}
