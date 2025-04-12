import { appDispatch, useAppSelector } from '../../../../app/hooks';
import { User, signIn, registerUser, updateRegistrationForm, AuthState } from '../../authSlice';
import { ReturnProps } from '../../../../hooks/useValidatingInput';
import StringUtil from '../../../../utils/StringUtil';
import { useEffect, useState } from 'react';
import { RootState } from '../../../../app/store';

export const useRegistrationForm = () => {
    const { isRegistering, registrationFormInfo: formState } = useAppSelector<RootState, AuthState>((state) => state.auth);
    const dispatch = appDispatch()
    const [ isValid, setValid ] = useState(false);

    useEffect(() => {
        if (!!!formState || formState.inputs === undefined) setValid(false)
        const isAllFieldValid: boolean = formState.inputs.every((input: any) => {
            return !!input?.value
        })
        const passwordState = formState.inputs.filter((input: any) => input.name === 'password')[0]
        const confirmPasswordState = formState.inputs.filter((input: any) => input.name === 'confirmPassword')[0]
        const isConfirmedPassword: boolean = !!passwordState && !!confirmPasswordState
            && passwordState.value === confirmPasswordState.value
        setValid([isAllFieldValid, isConfirmedPassword].every(bool => bool))
    }, [ formState ])
    
    const registeringUser: User = formState.inputs?.reduce((acc: any, { name, value }: { name: string, value: any }) => {
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
        updateFormState: updateRegistrationForm,
    }

    const firstNameProps = {
        ...defaultInputProps,
        label: 'FIRST NAME',
        inputState: formState.inputs.filter((input: any) => input.name === 'firstName')[0],
        defaultErrorHelperText: 'Invalid First Name',
        textFieldProps,
    }

    const lastNameProps = {
        ...defaultInputProps,
        label: 'LAST NAME',
        inputState: formState.inputs.filter((input: any) => input.name === 'lastName')[0],
        defaultErrorHelperText: 'Invalid Last Name',
        textFieldProps,
    }

    const userNameProps = {
        ...defaultInputProps,
        field: 'userName',
        label: 'USER NAME',
        inputState: formState.inputs.filter((input: any) => input.name === 'userName')[0],
        defaultErrorHelperText: 'Invalid User Name',
        textFieldProps,
        validationOpt: { 
            ...validationOpt,
            validation: (value: string) => {
                const isValidFormat = StringUtil.isValidString(value, new RegExp(/^[A-Za-z0-9]+$/))
                return isValidFormat
            }, 
        },
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

    const confirmPasswordProps = {
        ...defaultInputProps,
        field: 'confirmPassword',
        label: 'CONFIRM PASSWORD',
        inputState: formState.inputs.filter((input: any) => input.name === 'confirmPassword')[0],
        defaultErrorHelperText: 'Password not matched',
        textFieldProps: {
            ...textFieldProps,
            type: 'password',
        },
        validationOpt: { 
            ...validationOpt,
            validation: (value: string) => {
                const passwordState = formState.inputs.filter((input: any) => input.name === 'password')[0]
                return passwordState?.value === value;
            }, 
        },
    }

    const handleRegister = () => {
        if (isValid) {
            dispatch(registerUser(registeringUser as User));
        }
    }

    const handleSignInSwitch = () => {
        dispatch(signIn())
    }

    return {
        inputs: {
            firstName: firstNameProps,
            lastName: lastNameProps,
            userName: userNameProps,
            email: emailProps,
            password: passwordProps,
            confirmPassword: confirmPasswordProps,
        },
        getRegisterDisableProps: () => {
            return isValid ? {}
                : {
                    disabled: true,
                    className: 'disabled'
                }
        },
        handleRegister,
        handleSignInSwitch,
        isRegistering,
    }
}
