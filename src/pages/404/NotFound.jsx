import React from 'react'
import './NotFound.css'
import { Link } from 'react-router-dom'
import { Box, Button } from '@mui/material'
const NotFound = () => {
  return (
    <Box sx={{ height: '100%' }}>
      <Box className="error-page">
        <Box>
          <h1 data-h1="404">404</h1>
          <p data-p="NOT FOUND">NOT FOUND</p>
        </Box>
      </Box>
      <Link to='/' style={{ textDecoration: 'none' }}>
        <Button
          sx={{
            cursor: 'pointer',
            position: 'fixed',
            right: '40px',
            bottom: '40px',
            background: '-webkit-repeating-linear-gradient(-45deg, #71b7e6, #69a6ce, #b98acc, #ee8176)',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: '24px',
            padding: '15px 30px',
            textDecoration: 'none',
            transition: '0.25s all ease-in-out',
            '&:hover': { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }
          }}
        >
          GO BACK
        </Button>
      </Link>
    </Box >
  )
}

export default NotFound

