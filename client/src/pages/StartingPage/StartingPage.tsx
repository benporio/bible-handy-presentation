import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { Navigation } from '../../components/Navigation/Navigation';
import { Outlet, useNavigate } from 'react-router';
import { PageComponent, Pages } from '../../app/pages';
import { useAppSelector } from '../../app/hooks';

interface StartingPageProps { }

export const StartingPage: React.FC<StartingPageProps> = () => {
    const auth = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.isLoggedIn) {
            navigate('/app/home');
        } else {
            navigate('/auth');
        }
    }, [auth])
    return (
        <Grid container direction={'column'}>
            <Grid item style={{
                position: 'sticky',
                top: 0,
                borderBottom: '1px solid #26323E',
                backgroundColor: '#101418',
                zIndex: 10,
            }} padding={2}>
                <Navigation items={Pages.filter(item => item.label === 'App')[0].subPages as PageComponent[]} />
            </Grid>
            <Grid item padding={2}>
                <Outlet />
            </Grid>
        </Grid>
    );
}