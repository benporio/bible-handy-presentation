import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiResponse } from '../../types/Response'
import { ApiError } from '../../types/Error'
import { login, register } from '../../api/services/Auth'
import Endpoint from '../../constants/endpoint'

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

type RegistrationInputName = 'firstName' | 'lastName' | 'userName' | 'email' | 'password' | 'confirmPassword'

export type InputState = { 
    name: RegistrationInputName 
    value: string
    isValid?: boolean 
}

type FormInfoState = {
    inputs: InputState[]
}

export type AuthState = {
    isLoggedIn: boolean
    isLoggingIn: boolean
    userData: UserData
    error: ApiError | null
    isRegistering: boolean
    authMethod: 'LOGIN' | 'REGISTER'
    registrationFormInfo: FormInfoState
    loginFormInfo: FormInfoState
    fromLoginPage: boolean
    isLogout: boolean
    currentRoute: string
}

const initialRegistrationState: FormInfoState = {
    inputs: [
        { name: 'firstName', value: ''},
        { name: 'lastName', value: ''},
        { name: 'userName', value: ''},
        { name: 'email', value: ''},
        { name: 'password', value: ''},
        { name: 'confirmPassword', value: '', isValid: true },
    ]
}

const initialLoginState: FormInfoState = {
    inputs: [
        { name: 'email', value: '', isValid: false},
        { name: 'password', value: '', isValid: false},
    ]
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
    isRegistering: false,
    authMethod: 'LOGIN',
    registrationFormInfo: initialRegistrationState,
    loginFormInfo: initialLoginState,
    fromLoginPage: false,
    isLogout: false,
    currentRoute: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            return initialState
        },
        resetError: (state) => {
            state.error = null
        },
        signUp(state) {
            state.authMethod = 'REGISTER'
        },
        signIn(state) {
            state.authMethod = 'LOGIN'
        },
        setCurrentRoute(state, action: PayloadAction<string>) {
            state.currentRoute = action.payload
        },
        setFromLoginPage(state, action: PayloadAction<boolean>) {
            state.fromLoginPage = action.payload
        },
        logoutUser(state) {
            state.isLogout = true
            localStorage.clear()
        },
        authorized(state, action: PayloadAction<UserData>) {
            state.userData = action.payload
            state.isLoggedIn = true;
            state.isLoggingIn = false;
        },
        updateRegistrationForm(state, action: PayloadAction<InputState>) {
            const inputState: InputState = action.payload
            state.registrationFormInfo.inputs = state.registrationFormInfo.inputs.map((input: InputState) => {
                if (input.name === inputState.name) return inputState;
                if (inputState.name === 'password' && input.name === 'confirmPassword') {
                    input.isValid = !!!input.value || input.value === inputState.value
                }
                return input
            })
        },
        updateLoginForm(state, action: PayloadAction<InputState>) {
            const inputState: InputState = action.payload
            state.loginFormInfo.inputs = state.loginFormInfo.inputs.map((input: InputState) => {
                if (input.name === inputState.name) return inputState;
                return input
            })
        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isRegistering = true;
            state.error = null
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
            state.isRegistering = false;
        })
        builder.addCase(loginUser.pending, (state) => {
            state.isLoggingIn = true;
            state.error = null
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
            state.isLoggingIn = false;
        })
    },
})

export const registerUser = createAsyncThunk<UserData,User>(Endpoint.AUTH_REGISTER, async (signUpUser: User, { rejectWithValue }) => {
    try {
        const response: ApiResponse = await register(signUpUser)
        if ([200, 201].includes(response.statusCode)) {
            return response.data as UserData
        }
        return rejectWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const loginUser = createAsyncThunk<UserData,LoginInfo>(Endpoint.AUTH_LOGIN, async (loginInfo: LoginInfo, { rejectWithValue }) => {
    try {
        const response: ApiResponse = await login(loginInfo)
        if (response.statusCode === 200) {
            return response.data as UserData
        }
        return rejectWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const {
    reset,
    signUp,
    signIn,
    authorized,
    logoutUser,
    setFromLoginPage,
    setCurrentRoute,
    updateRegistrationForm,
    updateLoginForm,
    resetError,
} = authSlice.actions

export default authSlice.reducer