import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

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
    error: any
    isLoggingError: boolean
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
    isLoggingError: false,
    isRegistering: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        register(state, action: PayloadAction<boolean>) {

        },
        login(state, action: PayloadAction) {

        }
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
        builder.addCase(registerUser.rejected, (state, action) => {
            // if (action.payload) {
            //     // Since we passed in `MyKnownError` to `rejectValue` in `updateUser`, the type information will be available here.
            //     state.error = action.payload.errorMessage
            // } else {
            //     state.error = action.error
            // }
            state.error = action.error
        })
    },
})

export const registerUser = createAsyncThunk<UserData,User>('auth/register', async (signUpUser: User) => {
    console.log('called', signUpUser)
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpUser)
    })
    // if (response.status === 400) {
    //     // Return the known error for future handling
    //     return thunkApi.rejectWithValue((await response.json()) as MyKnownError)
    // }
    return (await response.json()) as User
})

export const loginUser = createAsyncThunk<UserData,LoginInfo>('auth/login', async (loginInfo: LoginInfo) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
    })
    // if (response.status === 400) {
    //     // Return the known error for future handling
    //     return thunkApi.rejectWithValue((await response.json()) as MyKnownError)
    // }
    return (await response.json()) as User
})

export default authSlice.reducer