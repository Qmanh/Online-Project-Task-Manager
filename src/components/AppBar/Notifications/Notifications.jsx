import moment from 'moment'
import { useEffect, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { BOARD_INVITATION_STATUS } from '~/utils/constant'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Box, Button, Chip, Divider, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { addNotifications, fetchInvitationsAPI, selectCurrentNotifications, updateBoardInvitationAPI } from '~/redux/notifications/notificationsSlice'
import { socket } from '~/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const notifications = useSelector(selectCurrentNotifications)

  const [newNotification, setNewNotification] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    setNewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    dispatch(fetchInvitationsAPI())

    //Tao func xu ly khi nhan duoc su kien real-time
    const onReceiveNewInvitation = (invitation) => {
      //neu user dang dang nhap hien tai trong redux chinh la thang invite trong invitation
      if (invitation.inviteId === currentUser._id) {
        //B1: them bang ghi invitation moi trong redux
        dispatch(addNotifications(invitation))

        //B2: cap nhat trang thai co thong bao
        setNewNotification(true)
      }
    }

    //lang nghe su kien real-time BE_USER_INVITED_TO_BOARD tu server gui ve
    socket.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)

    //clean up event tranh lap lai
    return () => {
      socket.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }

  }, [dispatch, currentUser._id])
  const updateBoardInvitation = (invitationId, status) => {
    dispatch(updateBoardInvitationAPI({ invitationId, status }))
      .then(res => {
        if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
          navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        }
      })
  }
  return (
    <Box>
      <Tooltip title='Notifications'>
        <Badge
          color='warning'
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id='basic-button-open-notification'
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{ color: newNotification ? 'yellow' : 'white' }} />
        </Badge>
      </Tooltip>
      <Menu
        sx={{ mt: 2 }}
        id='basic-notification-drop-down'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications.length === 0) &&
          <MenuItem sx={{ minWidth: 200 }}>
            You do not have any new notifications.
          </MenuItem>
        }
        {notifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem
              sx={{
                minWidth: 200,
                maxWidth: 360,
                overflowY: 'auto'
              }}
            >
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <GroupAddIcon fontSize='small' />
                  </Box>
                  <Box>
                    <strong>{notification?.inviter?.displayName}</strong> had invited you to join the&nbsp;
                    <strong>{notification?.board?.title}</strong>
                  </Box>
                </Box>
                {notification.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING &&
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='success'
                      size='small'
                      onClick={() => updateBoardInvitation(notification._id, BOARD_INVITATION_STATUS.ACCEPTED)}
                    >
                      Accept
                    </Button>
                    <Button
                      className='interceptor-loading'
                      type='submit'
                      variant='contained'
                      color='secondary'
                      size='small'
                      onClick={() => updateBoardInvitation(notification._id, BOARD_INVITATION_STATUS.REJECTED)}
                    >
                      Reject
                    </Button>
                  </Box>
                }
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                    <Chip icon={<DoneIcon />} label='Accepted' color='success' size='small' />
                  }
                  {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED &&
                    <Chip icon={<NotInterestedIcon />} label='Rejected' size='small' />
                  }
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='span' sx={{ fontSize: '13px' }}>
                    {moment(notification?.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {index !== (notifications?.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
