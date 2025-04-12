import React, { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material';
import { LoginForm } from '../../features/auth/components/LoginForm/LoginForm';
import { RegistrationForm } from '../../features/auth/components/RegistrationForm/RegistrationForm';
import { appDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom'
import { useAlertContext } from '../../contexts/AlertContext';
import { authorized, AuthState, resetError, setFromLoginPage, UserData } from '../../features/auth/authSlice';
import { homeRoute } from '../../app/pages';
import { useAuthContext } from '../../contexts/AuthContext/AuthContext';
import Logger from '../../utils/Logger';
import StringConstant from '../../constants/stringConstant';
import { RootState } from '../../app/store';

interface AuthenticationProps { }

export const Authentication: React.FC<AuthenticationProps> = () => {
    Logger.debug('rendering Authentication...')
    const { validateToken } = useAuthContext();
    const { isLoggedIn, error, authMethod, fromLoginPage, currentRoute, userData } = useAppSelector<RootState, AuthState>((state) => state.auth);
    const [ isPageLoading, setPageLoading ] = useState(true);
    const { showAlert, closeAlert, showAlertError } = useAlertContext();
    const navigate = useNavigate();
    const dispatch = appDispatch()

    const homePageRedirect = () => {
        if (fromLoginPage) {
            Logger.debug('creating delay...')
            const delayNavigation = setTimeout(() => {
                closeAlert()
                navigate(homeRoute);
            }, Number(process.env.REACT_APP_LOGIN_TO_HOME_DELAY) || 1000);
            dispatch(setFromLoginPage(false))
            return () => {
                clearTimeout(delayNavigation);
            };
        } else {
            if (!!currentRoute) {
                Logger.debug('navigating to current route: ', currentRoute)
                navigate(currentRoute);
            } else {
                navigate(homeRoute);
            }
        }
    }

    const authorizedRedirect = (userData: UserData): VoidFunction => {
        dispatch(authorized(userData as UserData))
        homePageRedirect()
        return () => {}
    }

    const nonauthorizedRedirect = (): VoidFunction => {
        setPageLoading(false)
        dispatch(setFromLoginPage(false))
        return () => {}
    }

    const onAuthenticationPageFocus = () => {
        const alreadyLoggedInCallBack = (userData: UserData): VoidFunction => {
            window.removeEventListener('focus', onAuthenticationPageFocus)
            return authorizedRedirect(userData);
        }
        const doValidateToken = !!localStorage.getItem(StringConstant.ACCESS_TOKEN_ALIAS)
        Logger.debug('doValidateToken: ', doValidateToken)
        if (doValidateToken) validateToken<VoidFunction>(alreadyLoggedInCallBack, nonauthorizedRedirect);
    }

    useEffect(() => {
        window.addEventListener('focus', onAuthenticationPageFocus)
        return () => window.removeEventListener('focus', onAuthenticationPageFocus)
    }, [])

    useEffect(() => {
        Logger.debug('Authentication... isLoggedIn: ', isLoggedIn, 'authMethod: ', authMethod)
        if (isLoggedIn) {
            homePageRedirect()
        } else {
            validateToken<VoidFunction>(authorizedRedirect, nonauthorizedRedirect);
        }
    }, [isLoggedIn])

    useEffect(() => {
        if (!!error) {
            showAlertError(error)
            dispatch(resetError())
        } else {
            const hasLoggedIn = !!localStorage.getItem(StringConstant.ACCESS_TOKEN_ALIAS) && !!userData
                && !!userData.userName && isLoggedIn && fromLoginPage;
            if (hasLoggedIn) {
                showAlert('Authentication success', 'success')
            }
        }
    }, [error, userData])

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
