import { Avatar, Box, Button, InputAdornment, TextField, Tooltip, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validators'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import MailIcon from '@mui/icons-material/Mail'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'

const AccounTab = () => {
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const initialGeneralForm = {
    displayName: currentUser?.displayName
  }

  //su dung defaultvalues de set gia tri mac dinh cho cac field can thiet
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialGeneralForm
  })

  const submitChangeGeneralInformation = (data) => {
    const { displayName } = data

    if (displayName === currentUser?.displayName) return

    toast.promise(
      dispatch(updateUserAPI(data)),
      { pending: 'Updating...' }
    ).then(res => {
      if (!res.error) {
        toast.success('User updated successfully!')
      }
    })
  }

  const uploadAvatar = (e) => {
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('avatar', e.target?.files[0])

    // for (const value of reqData.values()) {
    //   console.log('reqData value: ', value)
    // }
    toast.promise(
      dispatch(updateUserAPI(reqData)),
      { pending: 'Updating...' }
    ).then(res => {
      if (!res.error) {
        toast.success('User updated successfully!')
      }
      e.target.value = ''
    })
  }
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Avatar
              sx={{ width: 84, height: 84, mb: 1 }}
              alt='avatar'
              src={currentUser?.avatar}
            />
            <Tooltip title="Upload new image">
              <Button
                component="label"
                variant='contained'
                size='small'
                startIcon={<CloudUploadIcon />}
              >
                Upload
                <VisuallyHiddenInput type='file' onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant='h6'>{currentUser?.displayName}</Typography>
            <Typography sx={{ color: 'gay' }}>@{currentUser?.userName}</Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label='Your email'
                type='text'
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.userName}
                fullWidth
                label='Your userName'
                type='text'
                variant='filled'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label='Your display name'
                type='text'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIndIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
                {...register('displayName', {
                  required: FIELD_REQUIRED_MESSAGE
                })
                }
                error={!!errors['displayName']}
              />
              <FieldErrorAlert errors={errors} fieldName={'displayName'} />
            </Box>

            <Box>
              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
              >
                Update
              </Button>
            </Box>
          </Box>
        </form>

      </Box>
    </Box>
  )
}

export default AccounTab
