import { Box, Button, Popover, TextField, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { inviteUserToBoardAPI } from '~/apis'
import { socket } from '~/socketClient'

const InviteBoardUser = ({ boardId }) => {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const submitInviteUserToBoard = (data) => {
    const { inviteEmail } = data

    inviteUserToBoardAPI({ inviteEmail, boardId }).then(invitation => {
      setValue('inviteEmail', null)
      setAnchorPopoverElement(null)

      //gui email su kien socket len server(real-time)
      socket.emit('FE_USER_INVITED_TO_BOARD', invitation)
    })
  }
  return (
    <Box>
      <Tooltip title='Invite user to this board!'>
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant='contained'
          startIcon={<PersonAddIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Invite
        </Button>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <form onSubmit={handleSubmit(submitInviteUserToBoard)} style={{ width: '320px' }}>
          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='span' sx={{ fontWeight: 'bold', fontSize: '16px' }}>
              Invite user to this board!
            </Typography>
            <Box>
              <TextField
                autoFocus
                fullWidth
                label='Enter email to invite...'
                type='text'
                variant='outlined'
                {...register('inviteEmail', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
                error={!!errors['inviteEmail']}
              />
              <FieldErrorAlert errors={errors} fieldName={'inviteEmail'} />
            </Box>
            <Box sx={{ alignSelf: 'flex-end' }}>
              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='info'
              >
                Invite
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser
