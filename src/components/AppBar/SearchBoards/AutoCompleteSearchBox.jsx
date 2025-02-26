import { Autocomplete, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'

const AutoCompleteSearchBox = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) { setBoards(null) }
  }, [open])

  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return
    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`

    //call api
    setLoading(true)
    fetchBoardsAPI(searchPath)
      .then(res => {
        setBoards(res.boards || [])
      })
      .finally(() => {
        //Luu y ve viec setLoading ve false luon phai chay o finally, du co loi hay ko cung ko loading nua
        setLoading(false)
      })
  }
  //Boc ham handlInputSearchChange o tren vao useDebounceFn va cho delay 1s sau khi dung go phim thi moi chay func
  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 1000)

  const handleSelectedBoard = (event, selectBoard) => {
    if (selectBoard) {
      navigate(`/boards/${selectBoard._id}`, { replace: true })
    }
  }

  return (
    <Autocomplete
      sx={{ width: 220 }}
      id='asynchonous-search-board'
      noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}
      open={open}
      onOpen={() => { setOpen(true) }}
      onClose={() => { setOpen(false) }}
      getOptionLabel={(board) => board.title}
      options={boards || []}
      loading={loading}
      onInputChange={debounceSearchBoard}
      onChange={handleSelectedBoard}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search..."
          type="text"
          size='small'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            },
            'MuiSvgIcon-root': { color: 'white' }
          }}
        />
      )}
    >

    </Autocomplete>
  )
}

export default AutoCompleteSearchBox
