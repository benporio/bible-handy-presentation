import { ButtonBase, Grid } from '@mui/material';
import React from 'react';
import { AnonymousProfilePic, AppLogo } from '../../asset/asset';
import { homeRoute, PageComponent } from '../../app/pages';
import { useLocation, useNavigate } from 'react-router-dom';
import { reset, logoutUser } from '../../features/auth/authSlice';
import { appDispatch, useAppSelector } from '../../app/hooks';
import { NavigationItem } from '../NavigationItem/NavigationItem';
import { logout } from '../../api/services/Auth';
import { useAuthContext } from '../../contexts/AuthContext/AuthContext';

interface NavigationProps { 
    items: PageComponent[]
}

export const Navigation: React.FC<NavigationProps> = ({
    items
}) => {
    const userData = useAppSelector((state) => state.auth.userData);
    const dispatch = appDispatch()
    const navigate = useNavigate();
    const location = useLocation();
    const { clearTokenCheckInterval } = useAuthContext();

    const handleLogout = () => {
        logout();
        dispatch(reset())
        dispatch(logoutUser())
        clearTokenCheckInterval()
    }

    const handleOnClickLogo = () => {
        navigate(homeRoute);
    }
    
    return (
        <Grid container direction={'column'} rowSpacing={2}>
            <Grid item>
                <ButtonBase disableRipple onClick={handleOnClickLogo}><AppLogo style={{ width: '100px', height: 'auto' }} /></ButtonBase>
            </Grid>
            <Grid item>
                <Grid container justifyContent={'space-between'} paddingX={2} alignItems={'center'}>
                    <Grid item>
                        <Grid container justifyContent={'space-between'} columnSpacing={10} alignItems={'center'}>
                            {items.map(page => {
                                return (
                                    <Grid key={page.id} item paddingX={2}>
                                        <NavigationItem 
                                            selected={location.pathname.includes(page.route)} 
                                            label={page.label} 
                                            onClick={() => navigate(page.route)}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container justifyContent={'space-between'} columnSpacing={10} alignItems={'center'}>
                            <Grid item paddingX={2}>
                                <Grid container justifyContent={'space-between'} columnSpacing={1} alignItems={'center'}>
                                    <Grid item paddingX={2}>
                                        <AnonymousProfilePic style={{ width: '40px', height: 'auto' }} />
                                    </Grid>
                                    <Grid item paddingX={2}>{userData.userName}</Grid>
                                </Grid>
                            </Grid>
                            <Grid item paddingX={2}>
                                <span onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}