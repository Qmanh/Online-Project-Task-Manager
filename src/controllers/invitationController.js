
import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'
const creatNewBoardInvitation = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id
    const resInvitation = await invitationService.creatNewBoardInvitation(req.body, inviterId)

    res.status(StatusCodes.CREATED).json(resInvitation)
  } catch (error) {
    next(error)
  }
}
const getInvitationsByUser = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const resInviation = await invitationService.getInvitationsByUser(userId)
    res.status(StatusCodes.OK).json(resInviation)
  } catch (error) {
    next(error)
  }
}
const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { invitationId } = req.params
    const { status } = req.body
    const updatedInvitation = await invitationService.updateBoardInvitation(userId, invitationId, status)

    res.status(StatusCodes.OK).json(updatedInvitation)
  } catch (error) {
    next(error)
  }
}
export const invitationController = {
  creatNewBoardInvitation, getInvitationsByUser, updateBoardInvitation
}