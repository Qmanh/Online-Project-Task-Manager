import { styled } from '@mui/material'
import React from 'react'
const HiddenInputStyles = styled('input')({
  display: 'none'
})
const VisuallyHiddenInput = (props) => {
  return <HiddenInputStyles {...props} />
}

export default VisuallyHiddenInput
