import Alert from '@mui/material/Alert'

const FieldErrorAlert = ({ errors, fieldName }) => {
  if (!errors || !errors[fieldName]) return null
  return (
    <Alert severity='error' sx={{ mt: '0.7rem', '.MuiAlert-message': { overflow: 'hidden' } }}>
      {errors[fieldName]?.message}
    </Alert>
  )
}

export default FieldErrorAlert
