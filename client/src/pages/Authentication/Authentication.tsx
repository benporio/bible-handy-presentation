import React, { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { RegisterForm } from '../../features/auth/components/RegistrationForm';
import { appDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom'
import { AlertType, useAlertContext } from '../../contexts/AlertContext';
import { reset } from '../../features/auth/authSlice';
import { AppMessage } from '../../types/Error';

interface AuthenticationProps { }

export const Authentication: React.FC<AuthenticationProps> = () => {
    const { isLoggedIn, error } = useAppSelector((state) => state.auth);
    const { showAlert, closeAlert } = useAlertContext();
    const navigate = useNavigate();
    const dispatch = appDispatch()

    useEffect(() => {
        if (isLoggedIn) {
            showAlert('Authentication success', 'success')
            setTimeout(() => {
                closeAlert()
                navigate('/app');
            }, 1000);
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (!!error) {
            const alertInfo: { message: string, type: AlertType } = {
                message: 'Something went wrong',
                type: 'error',
            }
            if (typeof error.message === 'string') {
                alertInfo.message = error.message
            } else if (!!error.message && !!error.message.length) {
                const messages: string[] = (error.message as AppMessage[]).map(m => m.message)
                alertInfo.message = messages.join(', ')
            }
            showAlert(alertInfo.message, alertInfo.type)
            dispatch(reset())
        }
    }, [error])

    const [ authMethod, setAuthMethod ] = useState('LOGIN');
    return (
        <Container >
            <Grid container padding={5} justifyContent='center'>
                {authMethod === 'LOGIN' ? 
                    <LoginForm setAuthMethod={setAuthMethod} />
                    :
                    <RegisterForm setAuthMethod={setAuthMethod} />
                }
            </Grid>
        </Container>
    );
}
