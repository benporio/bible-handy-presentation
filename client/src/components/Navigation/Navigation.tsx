import { Grid } from '@mui/material';
import React from 'react';
import { AnonymousProfilePic, AppLogo } from '../../asset/asset';
import { PageComponent } from '../../app/pages';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { appDispatch, useAppSelector } from '../../app/hooks';

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
    return (
        <Grid container direction={'column'} rowSpacing={2}>
            <Grid item>
                <AppLogo style={{ width: '100px', height: 'auto' }} />
            </Grid>
            <Grid item>
                <Grid container justifyContent={'space-between'} paddingX={2} alignItems={'center'}>
                    <Grid item>
                        <Grid container justifyContent={'space-between'} columnSpacing={10} alignItems={'center'}>
                            {items.map(page => {
                                return (
                                    <Grid key={page.id} item paddingX={2}>
                                    {location.pathname.includes(page.route) ?
                                        <>
                                            <span style={{ color: '#0094FF', fontWeight: 'bold' }}>{page.label}</span>
                                            <div style={{ borderRadius: 5, boxShadow: '0 0 5px 0px #0094FF', width: '100%', border: '1px solid #0094FF' }}/>
                                        </>
                                    : 
                                        <span onClick={() => navigate(page.route)} style={{ cursor: 'pointer' }}>{page.label}</span>
                                    }
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
                                <span onClick={() => dispatch(logout())} style={{ cursor: 'pointer' }}>Logout</span>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}