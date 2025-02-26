import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constant'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'

//Khoi tao gia tri cua mot cai slice trong redux
const initialState = {
  currentActiveBoard: null
}

export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    return res.data
  }
)

//Khoi tao mot cai slice trong kho redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //Reducers la noi xu ly du lieu dong bo
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      //Nhan du lieu tu redux thong qua action.payload
      const board = action.payload

      //Xu ly du lieu khi can thiet

      //Update lai du lieu cua currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCardInBoard: (state, action) => {
      //update nested data
      const incomingCard = action.payload

      //Tim dan tu board -> column ->card
      const column = state.currentActiveBoard.columns.find(c => c._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          // lay tat cac key trong incomingCard
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  //ExtraReducers: Noi xu ly du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload o day chinh la response.data return trong func call api
      let board = action.payload
      //thanh vien trong board se gop lai boi ownerIds va memberIds
      board.FE_allUsers = board.owners.concat(board.members)

      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })

      state.currentActiveBoard = board
    })
  }
})

//Actions: la noi de ca components su dung dispatch() de cap nhat du lieu tu redux
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions

//Selectors: la noi danh cho components goi bang hook useSelector() de lay du lieu tu redux
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

export const activeBoardReducer = activeBoardSlice.reducer