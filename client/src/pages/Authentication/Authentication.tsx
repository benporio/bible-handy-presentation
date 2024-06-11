import React, { useEffect } from 'react'
import { Container, Grid } from '@mui/material';
import { LoginForm } from '../../features/auth/components/LoginForm/LoginForm';
import { RegistrationForm } from '../../features/auth/components/RegistrationForm/RegistrationForm';
import { appDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom'
import { AlertType, useAlertContext } from '../../contexts/AlertContext';
import { reset } from '../../features/auth/authSlice';
import { AppMessage } from '../../types/Error';

interface AuthenticationProps { }

export const Authentication: React.FC<AuthenticationProps> = () => {
    const { isLoggedIn, error, authMethod } = useAppSelector((state) => state.auth);
    const { showAlert, closeAlert } = useAlertContext();
    const navigate = useNavigate();
    const dispatch = appDispatch()

    useEffect(() => {
        dispatch(reset())
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            showAlert('Authentication success', 'success')
            const delayNavigation = setTimeout(() => {
                closeAlert()
                navigate('/app');
            }, 1000);
            return () => {
                clearTimeout(delayNavigation);
            };
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (authMethod === 'LOGIN') {
            navigate('/auth/login', { replace: true })
        } else {
            navigate('/auth/register', { replace: true });
        }
    }, [authMethod])

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
    return (
        <Container >
            <Grid container padding={5} justifyContent='center'>
                {authMethod === 'LOGIN' ? 
                    <LoginForm />
                    :
                    <RegistrationForm />
                }
            </Grid>
        </Container>
    );
}
