import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { Navigation } from '../../components/Navigation/Navigation';
import { Outlet, useNavigate } from 'react-router';
import { loginRoute, PageComponent, Pages} from '../../app/pages';
import { getUserData } from '../../api/services/Auth';
import { useAppSelector, appDispatch } from '../../app/hooks';
import { authorized, UserData, setPageLoading, setFromLoginPage, reset } from '../../features/auth/authSlice';
import { ApiResponse } from '../../types/Response';

interface StartingPageProps { }

export const StartingPage: React.FC<StartingPageProps> = () => {
    const { isLoggedIn, authMethod, isPageLoading, isLogout } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = appDispatch()

    const validateToken = async () => {
        try {
            const userData: ApiResponse = await getUserData();
            if (!!userData) {
                dispatch(authorized(userData.data as UserData))
            }
        } catch (error) {
            console.error('Token validation failed', error)
        }
        dispatch(setPageLoading(false))
        dispatch(setFromLoginPage(false))
        navigate(loginRoute);
        return () => {}
    };

    useEffect(() => {
        dispatch(setPageLoading(true))
        console.log('isLoggedIn: ', isLoggedIn, 'authMethod: ', authMethod)
        if (!isLoggedIn && !isLogout) {
            console.log('home page validateToken...')
            validateToken();
        } else if (isLogout) {
            dispatch(reset())
            navigate(loginRoute);
        } else {
            dispatch(setPageLoading(false))
        }
    }, [isLoggedIn])

    return isPageLoading ? <></> : (
        <Grid container direction={'column'}>
            <Grid item style={{
                position: 'sticky',
                top: 0,
                borderBottom: '1px solid #26323E',
                backgroundColor: '#101418',
                zIndex: 10,
            }} padding={2}>
                <Navigation items={Pages.filter(item => item.label === 'Bible Handy Presentation')[0].subPages as PageComponent[]} />
            </Grid>
            <Grid item padding={2}>
                <Outlet />
            </Grid>
        </Grid>
    );
}