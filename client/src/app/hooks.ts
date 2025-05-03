import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

export const appDispatch = useDispatch.withTypes<AppDispatch>()
type DispatchResult = { meta: { requestStatus: 'fulfilled' | 'pending' | 'rejected' }, error: any, payload: { message: string } }
export const resultDispatch = (res: unknown, successCB: VoidFunction, errorCB?: VoidFunction) => {
    const result = res as DispatchResult
    if (result.meta.requestStatus === 'fulfilled') {
        successCB()
    } else if (result.meta.requestStatus === 'rejected') {
        if (errorCB) {
            errorCB()
        } else {
            throw new Error(result.payload?.message || result.error?.message)
        }
    }
    return (result:  DispatchResult) => {}
}
export const useAppSelector = useSelector.withTypes<RootState>()