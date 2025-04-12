import { appDispatch, useAppSelector } from '../../../../app/hooks';
import { User, loginUser, updateLoginForm, signUp, InputState, setFromLoginPage, AuthState } from '../../authSlice';
import { ReturnProps } from '../../../../hooks/useValidatingInput';
import StringUtil from '../../../../utils/StringUtil';
import { useEffect, useState } from 'react';
import { RootState } from '../../../../app/store';

export const useLoginForm = () => {
    const { isLoggingIn, loginFormInfo: formState } = useAppSelector<RootState, AuthState>((state) => state.auth);
    const dispatch = appDispatch()
    const [ isValid, setValid ] = useState(false);

    useEffect(() => {
        if (!!!formState || formState.inputs === undefined) setValid(false)
        const isAllFieldValid: boolean = formState.inputs.every((input: InputState) => {
            return !!input.value && (input.isValid === undefined || input.isValid)
        })
        setValid(isAllFieldValid)
    }, [ formState ])
    
    const loggingInUser: User = formState.inputs?.reduce((acc: any, { name, value }: { name: string, value: any }) => {
        return {
            ...acc,
            [name]: value
        }
    }, {}) as User

    const validationOpt =  {
        parseReturnProps<RegistrationFormInputProps>({formInputState, isError, helperText, handleChange}: ReturnProps): RegistrationFormInputProps {
            return {
                formInputState,
                error: isError,
                helperText,
                onChange: handleChange,
            } as RegistrationFormInputProps
        }
    }
    
    const textFieldProps = {
        type: 'text',
        margin: 'dense',
        color: 'secondary'
    }

    const defaultInputProps: any = {
        validationOpt: { 
            ...validationOpt,
        },
        updateFormState: updateLoginForm,
    }

    const emailProps = {
        ...defaultInputProps,
        field: 'email',
        label: 'EMAIL ADDRESS',
        inputState: formState.inputs.filter((input: any) => input.name === 'email')[0],
        defaultErrorHelperText: 'Invalid Email',
        textFieldProps,
        validationOpt: { 
            ...validationOpt,
            validation: (value: string) => StringUtil.isEmailValid(value), 
        },
    }

    const passwordProps = {
        ...defaultInputProps,
        field: 'password',
        label: 'PASSWORD',
        inputState: formState.inputs.filter((input: any) => input.name === 'password')[0],
        defaultErrorHelperText: 'Invalid Password',
        textFieldProps: {
            ...textFieldProps,
            type: 'password',
        },
    }

    const handleLogin = () => {
        if (isValid) {
            dispatch(setFromLoginPage(true))
            dispatch(loginUser(loggingInUser as User));
        }
    }

    const handleSignUpSwitch = () => {
        dispatch(signUp())
    }

    return {
        inputs: {
            email: emailProps,
            password: passwordProps,
        },
        getLoginDisableProps: () => {
            return isValid ? {}
                : {
                    disabled: true,
                    className: 'disabled'
                }
        },
        handleLogin,
        handleSignUpSwitch,
        isLoggingIn,
    }
}
