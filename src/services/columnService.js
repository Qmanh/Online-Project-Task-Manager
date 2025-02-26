/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'


const creatNew = async (data) => {
  try {
    const newColumn = { ...data }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []

      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw error
  }
}
const updateColumnDetails = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.updateColumnDetails(columnId, updateData)
    return updatedColumn
  } catch (error) {
    throw error
  }
}
const deleteColumnDetails = async (columnId) => {
  try {
    const columnData = await columnModel.findOneById(columnId)
    if (!columnData) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found...')
    }
    await columnModel.deleteColumnOneById(columnId)
    await cardModel.deleteManyByColumnId(columnId)
    await boardModel.pullColumnOrderIds(columnData)
    return { deleteResult: 'Column and its cards deleted successfully!' }
  } catch (error) {
    throw error
  }
}
export const columnService = {
  creatNew, updateColumnDetails, deleteColumnDetails
}
