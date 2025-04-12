import { configureStore } from '@reduxjs/toolkit'
import auth from '../features/auth/authSlice'
import biblePassageSearch from '../features/biblePassageSearch/biblePassageSearchSlice'
import logger from 'redux-logger'

export const store = configureStore({
    reducer: {
        auth,
        biblePassageSearch,
    },
    devTools: true,
    ...(process.env.REACT_APP_MODE === 'PROD' ? {} : {
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch