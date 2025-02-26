import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

const PageLoadingSpinner = ({ caption }) => {
  return (
    <Box sx={{
      margin: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      width: '100vh',
      height: '100vh'
    }}
    >
      <CircularProgress />
      <Typography>{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner
