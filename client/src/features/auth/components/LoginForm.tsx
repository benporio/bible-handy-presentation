import React, { ChangeEventHandler } from 'react'
import { Button, Grid, TextField } from '@mui/material';
import { AppLogo } from '../../../asset/asset';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { appDispatch } from '../../../app/hooks';
import { loginUser } from '../authSlice';
import { ReturnProps, useValidatingInput } from '../../../hooks/useValidatingInput';
import StringUtil from '../../../utils/StringUtil';

interface LoginFormProps { 
    setAuthMethod: React.Dispatch<React.SetStateAction<string>>
}

type LoginFormInputProps = {
    value: string
    error: boolean
    helperText: string
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export const LoginForm: React.FC<LoginFormProps> = ({
    setAuthMethod
}) => {
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
    const emailProps: LoginFormInputProps = useValidatingInput<LoginFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid Email' }, 
        { 
            ...validationOpt, 
            validation: (value: string) => StringUtil.isValidString(value, new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)),
        }
    ) as LoginFormInputProps
    const passwordProps: LoginFormInputProps = useValidatingInput<LoginFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid Password' }, validationOpt
    ) as LoginFormInputProps
    const loginInfo = {
        email: emailProps.value,
        password: passwordProps.value
    }
    const isAllValidatingInputValid = !emailProps.error && !passwordProps.error
        && !!emailProps.value && !!passwordProps.value
    const handleLogin = () => {
        if (isAllValidatingInputValid) {
            dispatch(loginUser(loginInfo));
        }
    }
    const loginDisableProps = !isAllValidatingInputValid ? {
        disabled: true,
        className: 'disabled'
    } : {}
    return (
        <Grid item className='primary' style={{ height: '600px', width: '700px' }}>
            <Grid container direction='column' justifyContent='flex-end' height='100%' margin={0} padding={2} >
                <Grid item alignSelf='center' marginBottom='auto' marginTop='auto'>
                    <Grid container spacing={5} justifyContent='center' height='auto' alignItems='center' direction='column'>
                        <Grid item>
                            <AppLogo style={{ width: '400px', height: 'auto' }} />
                        </Grid>
                        <Grid item>
                            <Grid container direction='column'>
                                <Grid item>
                                    <TextField
                                        variant='outlined'
                                        margin="dense"
                                        label='EMAIL'
                                        type='text'
                                        color='primary'
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                        { ...emailProps }
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        margin="dense"
                                        label='PASSWORD'
                                        type='password'
                                        color='primary'
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                        { ...passwordProps }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button { ...loginDisableProps } onClick={handleLogin} color='primary' variant='contained' size='medium' autoFocus={false}>
                                <span className='b f4'>SIGN IN</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item alignSelf='flex-end'>
                    <Button endIcon={<FontAwesomeIcon icon={faCircleChevronRight} />} className='br2' 
                        color='secondary' variant='contained' size='small' autoFocus={false}
                        onClick={() => setAuthMethod('REGISTER')}>
                        <span className='b'>SIGN UP</span>
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
