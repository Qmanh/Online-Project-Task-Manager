/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'

const creatNewBoardInvitation = async (data, inviterId) => {
  try {
    const inviter = await userModel.findOneById(inviterId)

    const invite = await userModel.findOneByEmail(data.inviteEmail)

    const board = await boardModel.findOneById(data.boardId)

    if (!inviter || !invite || !board) throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, Invite or Board not found...')

    const newInvitationData = {
      inviterId,
      inviteId: invite._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    const resInviation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invite: pickUser(invite)
    }
    return resInviation
  } catch (error) { throw error }
}

const getInvitationsByUser = async (userId) => {
  try {
    const invitations = await invitationModel.findByUser(userId)

    const resInviations = invitations.map(i => {
      return {
        ...i,
        inviter: i.inviter[0] || {},
        invite: i.invite[0] || {},
        board: i.board[0] || {}
      }
    })

    return resInviations
  } catch (error) {
    throw error
  }
}

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found...')

    const boardId = getInvitation.boardInvitation.boardId
    const getBoard = await boardModel.findOneById(boardId)
    if (!getBoard) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found...')

    const boardOwnerAndMemberIds = [...getBoard.ownerIds, ...getBoard.memberIds].toString()

    if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerAndMemberIds.includes(userId)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'User is already in member of board!')
    }

    const data = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status
      }
    }
    //cap nhat invitation
    const updatedData = await invitationModel.update(invitationId, data)

    //Khi accept thanh cong, update lai memberIds trong board
    if (updatedData.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {

      await boardModel.pushMemberIds(boardId, userId)
    }

    return updatedData
  } catch (error) {
    throw error
  }
}
export const invitationService = {
  creatNewBoardInvitation, getInvitationsByUser, updateBoardInvitation
}