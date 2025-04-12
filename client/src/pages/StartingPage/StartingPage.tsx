import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigation } from '../../components/Navigation/Navigation';
import { Outlet, useNavigate } from 'react-router';
import { loginRoute, PageComponent, Pages} from '../../app/pages';
import { useAppSelector, appDispatch } from '../../app/hooks';
import { AuthState, reset, setCurrentRoute } from '../../features/auth/authSlice';
import Logger from '../../utils/Logger';
import { useAlertContext } from '../../contexts/AlertContext';
import { RootState } from '../../app/store';

interface StartingPageProps { }

export const StartingPage: React.FC<StartingPageProps> = () => {
    const { isLoggedIn, authMethod, isLogout, error } = useAppSelector<RootState, AuthState>((state) => state.auth);
    const [ isPageLoading, setPageLoading ] = useState(true);
    const navigate = useNavigate();
    const dispatch = appDispatch()
    const { showAlertError } = useAlertContext();

    useEffect(() => {
        Logger.debug('StartingPage... isLoggedIn: ', isLoggedIn, 'authMethod: ', authMethod)
        if (!isLoggedIn || isLogout) {
            const pathName = window.location.pathname;
            if (pathName !== loginRoute) {
                Logger.debug('setting current route: ', window.location.pathname)
                dispatch(setCurrentRoute(window.location.pathname))
            }
            if (isLogout) {
                dispatch(reset())
            }
            navigate(loginRoute);
        } else {
            setPageLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!!error) {
            Logger.error('StartingPage Error: ', error)
            showAlertError(error)
        }
    }, [error])

    return isPageLoading ? <></> : (
        <Grid container direction={'column'}>
            <Grid item sx={{
                position: 'sticky',
                top: 0,
                borderBottom: '1px solid #26323E',
                backgroundColor: '#101418',
                zIndex: 10
            }} padding={2}>
                <Navigation items={Pages.filter(item => item.label === 'Bible Handy Presentation')[0].subPages as PageComponent[]} />
            </Grid>
            <Grid item padding={2}>
                <Outlet />
            </Grid>
        </Grid>
    );
}