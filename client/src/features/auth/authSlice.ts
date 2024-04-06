import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApiResponse } from '../../types/Response'
import { ApiError } from '../../types/Error'

export type LoginInfo = {
    email: string
    password: string
}

export type UserData = {
    firstName: string
    lastName: string
    userName: string
}

export type User = LoginInfo & UserData

type AuthState = {
    isLoggedIn: boolean
    isLoggingIn: boolean
    userData: UserData
    error: ApiError | null
    isRegistering: boolean
}

const initialState: AuthState = {
    isLoggedIn: false,
    isLoggingIn: false,
    userData: {
        firstName: '',
        lastName: '',
        userName: '',
    },
    error: null,
    isRegistering: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            return initialState
        },
        register(state, action: PayloadAction<boolean>) {

        },
        login(state, action: PayloadAction) {

        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isRegistering = true;
        })
        builder.addCase(registerUser.fulfilled, (state, { payload }) => {
            state.userData = payload
            state.isLoggedIn = true;
            state.isRegistering = false;
        })
        builder.addCase(registerUser.rejected, (state, { payload }) => {
            const error = payload as ApiError
            if (!!error) {
                state.error = error
            }
        })
        builder.addCase(loginUser.pending, (state) => {
            state.isLoggingIn = true;
        })
        builder.addCase(loginUser.fulfilled, (state, { payload }) => {
            state.userData = payload
            state.isLoggedIn = true;
            state.isLoggingIn = false;
        })
        builder.addCase(loginUser.rejected, (state, { payload }) => {
            const error = payload as ApiError
            if (!!error) {
                state.error = error
            }
        })
    },
})

export const registerUser = createAsyncThunk<UserData,User>('auth/register', async (signUpUser: User, { rejectWithValue }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpUser)
    })
    const apiResponse: ApiResponse = (await response.json()) as ApiResponse
    if (apiResponse.statusCode === 400) {
        return rejectWithValue(apiResponse)
    }
    return apiResponse.data as UserData
})

export const loginUser = createAsyncThunk<UserData,LoginInfo>('auth/login', async (loginInfo: LoginInfo, { rejectWithValue }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
    })
    const apiResponse: ApiResponse = (await response.json()) as ApiResponse
    if (apiResponse.statusCode === 401) {
        return rejectWithValue(apiResponse)
    }
    return apiResponse.data as UserData
})

export const {
    reset,
} = authSlice.actions

export default authSlice.reducer