
export const inviteUserToBoardSocket = (socket) => {
  //lang nghe su kien tu client emit
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}