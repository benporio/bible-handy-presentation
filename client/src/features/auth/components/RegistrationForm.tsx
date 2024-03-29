import React, { useState } from 'react'
import { Button, Grid, TextField } from '@mui/material';
import { AppLogo } from '../../../asset/asset';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { appDispatch, useAppSelector } from '../../../app/hooks';
import { User, registerUser } from '../authSlice';

interface RegisterFormProps { 
    setAuthMethod: React.Dispatch<React.SetStateAction<string>>
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    setAuthMethod
}) => {

    const user = useAppSelector((state) => state.auth.user);
    const dispatch = appDispatch()

    const [firstName, setFirstName] = useState<string>(user.firstName);
    const [lastName, setLastName] = useState<string>(user.lastName);
    const [userName, setUserName] = useState<string>(user.userName);
    const [email, setEmail] = useState<string>(user.email);
    const [password, setPassword] = useState<string>(user.password);
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const signUpUser: User = {
        firstName,
        lastName,
        userName,
        email,
        password,
    }

    const handleRegister = () => {
        console.log('called', signUpUser);
        dispatch(registerUser(signUpUser));
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
                    <Grid container padding={4} spacing={4} justifyContent='center' height='auto' alignItems='center' direction='column'>
                        <Grid item>
                            <Grid container justifyContent='center' spacing={1} direction='row'>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(e) => setFirstName(e.target.value)}
                                        margin="dense"
                                        label='FIRST NAME'
                                        type='text'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(e) => setLastName(e.target.value)}
                                        margin="dense"
                                        label='LAST NAME'
                                        type='text'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TextField
                                        onChange={(e) => setUserName(e.target.value)}
                                        margin="dense"
                                        label='USERNAME'
                                        type='text'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField
                                        onChange={(e) => setEmail(e.target.value)}
                                        margin="dense"
                                        label='EMAIL ADDRESS'
                                        type='text'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(e) => setPassword(e.target.value)}
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
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        margin="dense"
                                        label='CONFIRM PASSWORD'
                                        type='password'
                                        color='secondary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button onClick={handleRegister} 
                                color='secondary' variant='contained' size='medium' autoFocus={false}>
                                <span className='b f4'>SIGN UP</span>
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
