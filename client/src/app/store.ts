import { configureStore } from '@reduxjs/toolkit'
import auth from '../features/auth/authSlice'
import logger from 'redux-logger'

export const store = configureStore({
    reducer: {
        auth,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch