export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

//Ky thuat css pointer-event chan user spam click goi api
// tan dung Axios interceptor vs CSS pointer-events
//them class 'interceptor-loading' cho cac link hoac button co goi api
export const interceptorLoadingElements = (calling) => {
  //selectall cac phan tu co class 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      //dang doi call api thi se lam mo button va chan click bang pointerEvents
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}

