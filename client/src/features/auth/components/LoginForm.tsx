import React, { ChangeEventHandler } from 'react'
import { Button, Grid, TextField } from '@mui/material';
import { AppLogo } from '../../../asset/asset';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { ReturnProps, useValidatingInput } from '../../../hooks/useValidatingInput';

interface LoginFormProps { 
    setAuthMethod: React.Dispatch<React.SetStateAction<string>>
}

type LoginFormInputProps = {
    error: boolean
    helperText: string
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export const LoginForm: React.FC<LoginFormProps> = ({
    setAuthMethod
}) => {
    const validationOpt = { 
        parseReturnProps<LoginFormInputProps>({isError, helperText, handleChange}: ReturnProps): LoginFormInputProps {
            return {
                error: isError,
                helperText: helperText,
                onChange: handleChange,
            } as LoginFormInputProps
        }
    } 
    const emailProps: LoginFormInputProps = useValidatingInput<LoginFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid Email' }, validationOpt
    ) as LoginFormInputProps
    const passwordProps: LoginFormInputProps = useValidatingInput<LoginFormInputProps>(
        { initialValue: '',  defaultErrorHelperText: 'Invalid Password' }, validationOpt
    ) as LoginFormInputProps
    const navigate = useNavigate();
    return (
        <Grid item className='primary' style={{ height: '600px', width: '700px' }}>
            <Grid container direction='column' justifyContent='flex-end' height='100%' margin={0} padding={2} >
                <Grid item alignSelf='center' marginBottom='auto' marginTop='auto'>
                    <Grid container spacing={4} justifyContent='center' height='auto' alignItems='center' direction='column'>
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
                            <Button onClick={() => navigate('/app/home')} color='primary' variant='contained' size='medium' autoFocus={false}>
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
