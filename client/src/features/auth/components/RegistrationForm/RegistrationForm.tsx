import React from 'react'
import { Button, Grid } from '@mui/material';
import { AppLogo } from '../../../../asset/asset';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';
import { FormInput, FormInputProps } from '../../../../components/FormInput/FormInput';
import { useRegistrationForm } from './useRegistrationForm';

interface RegistrationFormProps { 
    
}

export const RegistrationForm: React.FC<RegistrationFormProps> = () => {
    const {
        inputs: {
            firstName,
            lastName,
            userName,
            email,
            password,
            confirmPassword,
        },
        getRegisterDisableProps,
        handleRegister,
        handleSignInSwitch,
        isRegistering,
    } = useRegistrationForm();

    return (
        <Grid item className='secondary' style={{ height: '600px', width: '700px' }}>
            <Helmet>
                <title>BHP | Register</title>
            </Helmet>
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
                                    <FormInput 
                                        { ...firstName as FormInputProps }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormInput 
                                        { ...lastName as FormInputProps }
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <FormInput 
                                        { ...userName as FormInputProps }
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <FormInput 
                                        { ...email as FormInputProps }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormInput 
                                        { ...password as FormInputProps }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormInput 
                                        { ...confirmPassword as FormInputProps }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button { ...getRegisterDisableProps() } onClick={handleRegister} 
                                color='secondary' variant='contained' size='medium' autoFocus={false}>
                                <span className='b f4'>{isRegistering ? <FontAwesomeIcon icon={faSpinner} spin />  : 'SIGN UP'}</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item alignSelf={'flex-start'}>
                    <Button startIcon={<FontAwesomeIcon icon={faCircleChevronLeft} />} className='br2' 
                        color='primary' variant='contained' size='small' autoFocus={false}
                        onClick={handleSignInSwitch}>
                        <span className='b'>SIGN IN</span>
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
