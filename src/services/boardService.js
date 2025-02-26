/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const creatNew = async (userId, data) => {
  try {
    const newBoard = {
      ...data,
      slug: slugify(data.title)
    }
    const createdBoard = await boardModel.createNew(userId, newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found...')
    }

    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const updateBoardDetails = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.updateBoardDetails(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await boardModel.getBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      queryFilters
    )

    return results
  } catch (error) {
    throw error
  }
}

//Move card
const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // B1: Cap nhat cardOrderIds cua Column ban dau (xoa id card ra khoi Column do)
    await columnModel.updateColumnDetails(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    // B2: Cap nhat cardOrderIds Column moi duoc tha( them id card vao mang cards cua column do)
    await columnModel.updateColumnDetails(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    // B3: Cap nhat lai columnId moi cho Card
    await cardModel.updateCardDetails(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })

    return { updatedResult: 'Successfully!' }
  } catch (error) {
    throw error
  }
}
export const boardService = {
  creatNew, getDetails, updateBoardDetails, moveCardToDifferentColumn, getBoards
}
