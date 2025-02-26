import { debounce } from 'lodash'
import { useCallback } from 'react'

export const useDebounceFn = (fnToDebounce, delay = 500) => {
  //tra loi luon ne delay nhan vao khong phai number
  if (isNaN(delay)) {
    throw new Error('Delay value should be a number.')
  }
  //tra loi luon neu fnToDebounce khong la 1 func
  if (!fnToDebounce || (typeof fnToDebounce !== 'function')) {
    throw new Error('Debounce must have a function')
  }

  //Boc cai thuc thi debounce tu lodash vao useCallBack tranh re-render nhieu lan, chi re-render khi fnToDebounce hoac delay thay doi
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(fnToDebounce, delay), [fnToDebounce, delay])
}