import React, { useEffect } from 'react'
import { Container, Grid } from '@mui/material';
import { LoginForm } from '../../features/auth/components/LoginForm/LoginForm';
import { RegistrationForm } from '../../features/auth/components/RegistrationForm/RegistrationForm';
import { appDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom'
import { AlertType, useAlertContext } from '../../contexts/AlertContext';
import { authorized, reset, setFromLoginPage, setPageLoading, UserData } from '../../features/auth/authSlice';
import { AppMessage } from '../../types/Error';
import { homeRoute } from '../../app/pages';
import { ApiResponse } from '../../types/Response';
import { getUserData } from '../../api/services/Auth';

interface AuthenticationProps { }

export const Authentication: React.FC<AuthenticationProps> = () => {
    const { isLoggedIn, error, authMethod, isPageLoading, fromLoginPage } = useAppSelector((state) => state.auth);
    const { showAlert, closeAlert } = useAlertContext();
    const navigate = useNavigate();
    const dispatch = appDispatch()

    const validateToken = async () => {
        try {
            const userData: ApiResponse = await getUserData();
            if (!!userData) {
                dispatch(authorized(userData.data as UserData))
                if (fromLoginPage) {
                    console.log('creating delay...')
                    const delayNavigation = setTimeout(() => {
                        closeAlert()
                        navigate(homeRoute);
                    }, 1000);
                    return () => {
                        clearTimeout(delayNavigation);
                    };
                } else {
                    console.log('no delay')
                    closeAlert()
                    navigate(homeRoute);
                }
            }
        } catch (error) {
            console.error('Token validation failed', error)
        }
        dispatch(setPageLoading(false))
        dispatch(setFromLoginPage(false))
        return () => {}
    };

    useEffect(() => {
        if (!fromLoginPage) dispatch(setPageLoading(true))
        console.log('isLoggedIn: ', isLoggedIn, 'authMethod: ', authMethod)
        if (isLoggedIn) {
            const delayNavigation = setTimeout(() => {
                closeAlert()
                navigate(homeRoute);
            }, 1000);
            return () => {
                clearTimeout(delayNavigation);
            };
        } else {
            console.log('login page validateToken...')
            validateToken();
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

    return isPageLoading ? <></> : (
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
