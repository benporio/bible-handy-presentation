import React from 'react'
import { Button, Grid } from '@mui/material';
import { AppLogo } from '../../../../asset/asset';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';
import { FormInput, FormInputProps } from '../../../../components/FormInput/FormInput';
import { useLoginForm } from './useLoginForm';

interface LoginFormProps { 
    
}

export const LoginForm: React.FC<LoginFormProps> = () => {
    const {
        inputs: {
            email,
            password,
        },
        getLoginDisableProps,
        handleLogin,
        handleSignUpSwitch,
        isLoggingIn,
    } = useLoginForm();
    return (
        <Grid item className='primary' style={{ height: '600px', width: '700px' }}>
            <Helmet>
                <title>BHP | Login</title>
            </Helmet>
            <Grid container direction='column' justifyContent='flex-end' height='100%' margin={0} padding={2} >
                <Grid item alignSelf='center' marginBottom='auto' marginTop='auto'>
                    <Grid container spacing={5} justifyContent='center' height='auto' alignItems='center' direction='column'>
                        <Grid item>
                            <AppLogo style={{ width: '400px', height: 'auto' }} />
                        </Grid>
                        <Grid item>
                            <Grid container direction='column'>
                                <Grid item>
                                    <FormInput 
                                        { ...email as FormInputProps }
                                    />
                                </Grid>
                                <Grid item>
                                    <FormInput 
                                        { ...password as FormInputProps }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button { ...getLoginDisableProps() } onClick={handleLogin} color='primary' variant='contained' size='medium' autoFocus={false}>
                                <span className='b f4'>{isLoggingIn ? <FontAwesomeIcon icon={faSpinner} spin />  : 'SIGN IN'}</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item alignSelf='flex-end'>
                    <Button endIcon={<FontAwesomeIcon icon={faCircleChevronRight} />} className='br2' 
                        color='secondary' variant='contained' size='small' autoFocus={false}
                        onClick={handleSignUpSwitch}>
                        <span className='b'>SIGN UP</span>
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
