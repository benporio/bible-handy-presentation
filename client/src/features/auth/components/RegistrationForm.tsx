import React, { ChangeEventHandler } from 'react'
import { Button, Grid, TextField } from '@mui/material';
import { AppLogo } from '../../../asset/asset';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { appDispatch, useAppSelector } from '../../../app/hooks';
import { User, registerUser } from '../authSlice';
import { ReturnProps, useValidatingInput } from '../../../hooks/useValidatingInput';
import StringUtil from '../../../utils/StringUtil';

interface RegisterFormProps { 
    setAuthMethod: React.Dispatch<React.SetStateAction<string>>
}

type RegisterFormInputProps = {
    value: string
    error: boolean
    helperText: string
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    setAuthMethod
}) => {
    const { isRegistering } = useAppSelector((state) => state.auth);
    const parseInputProps = ({value, error, helperText, onChange}: RegisterFormInputProps): RegisterFormInputProps => {
        return {value, error, helperText, onChange}
    }
    const dispatch = appDispatch()
    const validationOpt = { 
        parseReturnProps<LoginFormInputProps>({value, isError, helperText, handleChange}: ReturnProps): LoginFormInputProps {
            return {
                value,
                error: isError,
                helperText,
                onChange: handleChange,
            } as LoginFormInputProps
        }
    } 
    const firstNameProps: RegisterFormInputProps = useValidatingInput<RegisterFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid First Name' }, validationOpt
    ) as RegisterFormInputProps
    const lastNameProps: RegisterFormInputProps = useValidatingInput<RegisterFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid Last Name' }, validationOpt
    ) as RegisterFormInputProps
    const userNameProps: RegisterFormInputProps = useValidatingInput<RegisterFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid User Name' }, 
        { 
            ...validationOpt, 
            validation: (value: string) => StringUtil.isValidString(value, new RegExp(/^[A-Za-z0-9]+$/)),
        }
    ) as RegisterFormInputProps
    const emailProps: RegisterFormInputProps = useValidatingInput<RegisterFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid Email' }, 
        { 
            ...validationOpt, 
            validation: (value: string) => StringUtil.isEmailValid(value),
        }
    ) as RegisterFormInputProps
    const passwordProps: RegisterFormInputProps = useValidatingInput<RegisterFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid Password' }, 
        { 
            ...validationOpt, 
            changeCallback: () => {
                confirmPasswordProps.setValue('')
            },
        }
    ) as RegisterFormInputProps
    type confirmPasswordReturnProps = RegisterFormInputProps & { setValue: React.Dispatch<React.SetStateAction<string>> }
    const confirmPasswordProps: confirmPasswordReturnProps = useValidatingInput<confirmPasswordReturnProps>(
        { initialValue: '',  defaultErrorHelperText: 'Password not matched' }, 
        { 
            parseReturnProps<LoginFormInputProps>({value, setValue, isError, helperText, handleChange}: ReturnProps): LoginFormInputProps {
                return {
                    value,
                    setValue,
                    error: isError,
                    helperText,
                    onChange: handleChange,
                } as LoginFormInputProps
            }, 
            validation: (value: string) => value === passwordProps.value,
        }
    ) as confirmPasswordReturnProps
    const isAllValidatingInputValid = !firstNameProps.error && !lastNameProps.error && !userNameProps.error 
        && !emailProps.error && !passwordProps.error && !confirmPasswordProps.error
        && !!firstNameProps.value && !!lastNameProps.value && !!userNameProps.value 
        && !!emailProps.value && !!passwordProps.value && !!confirmPasswordProps.value
    
    const registerDisableProps = !isAllValidatingInputValid ? {
        disabled: true,
        className: 'disabled'
    } : {}

    const signUpUser: User = {
        firstName: firstNameProps.value,
        lastName: lastNameProps.value,
        userName: userNameProps.value,
        email: emailProps.value,
        password: passwordProps.value,
    }

    const handleRegister = () => {
        if (isAllValidatingInputValid) {
            dispatch(registerUser(signUpUser));
        }
    }

    return (
        <Grid item className='secondary' style={{ height: '600px', width: '700px' }}>
            <Grid container direction='column' justifyContent='flex-end' height='100%' margin={0} padding={2} >
                <Grid item alignSelf='flex-start'>
                    <Grid item>
                        <AppLogo style={{ width: '100px', height: 'auto' }} />
                    </Grid>
                </Grid>
                <Grid item alignSelf='center' marginBottom='auto' marginTop='auto'>
                    <Grid container padding={3} spacing={3} justifyContent='center' height='auto' alignItems='center' direction='column'>
                        <Grid item>
                            <Grid container justifyContent='center' spacing={1} direction='row'>
                                <Grid item xs={6}>
                                    <TextField
                                        margin="dense"
                                        label='FIRST NAME'
                                        type='text'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                        { ...parseInputProps(firstNameProps) }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        margin="dense"
                                        label='LAST NAME'
                                        type='text'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                        { ...parseInputProps(lastNameProps) }
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        margin="dense"
                                        label='USERNAME'
                                        type='text'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                        { ...parseInputProps(userNameProps) }
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        margin="dense"
                                        label='EMAIL ADDRESS'
                                        type='text'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                        { ...parseInputProps(emailProps) }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        margin="dense"
                                        label='PASSWORD'
                                        type='password'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { 
                                                height: '100%', 
                                            }
                                        }}
                                        { ...parseInputProps(passwordProps) }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        margin="dense"
                                        label='CONFIRM PASSWORD'
                                        type='password'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                        { ...parseInputProps(confirmPasswordProps) }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button { ...registerDisableProps } onClick={handleRegister} 
                                color='secondary' variant='contained' size='medium' autoFocus={false}>
                                <span className='b f4'>{isRegistering ? <FontAwesomeIcon icon={faSpinner} spin />  : 'SIGN UP'}</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item alignSelf={'flex-start'}>
                    <Button startIcon={<FontAwesomeIcon icon={faCircleChevronLeft} />} className='br2' 
                        color='primary' variant='contained' size='small' autoFocus={false}
                        onClick={() => setAuthMethod('LOGIN')}>
                        <span className='b'>SIGN IN</span>
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
