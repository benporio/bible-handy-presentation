import { Container, Grid, TextField } from '@mui/material';
import React from 'react';
import { AnonymousProfilePic, AppLogo } from '../../asset/asset';

interface HomeProps { }

export const Home: React.FC<HomeProps> = () => {
    return (
        <Grid container direction={'column'}>
            <Grid item style={{
                position: 'sticky',
                top: 0,
                borderBottom: '0.1% solid gray',
            }} padding={2}>
                <Grid container direction={'column'} rowSpacing={2}>
                    <Grid item>
                        <AppLogo style={{ width: '100px', height: 'auto' }} />
                    </Grid>
                    <Grid item>
                        <Grid container justifyContent={'space-between'} paddingX={2} alignItems={'center'}>
                            <Grid item>
                                <Grid container justifyContent={'space-between'} columnSpacing={10} alignItems={'center'}>
                                    <Grid item paddingX={2}> 
                                        <span style={{ color: '#0094FF', fontWeight: 'bold' }}>Home</span>
                                        <div style={{ borderRadius: 5, boxShadow: '0 0 5px 0px #0094FF', width: '100%', border: '1px solid #0094FF' }}/>
                                    </Grid>
                                    <Grid item paddingX={2}>About</Grid>
                                    <Grid item paddingX={2}>Contact</Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container justifyContent={'space-between'} columnSpacing={10} alignItems={'center'}>
                                    <Grid item paddingX={2}>
                                        <Grid container justifyContent={'space-between'} columnSpacing={1} alignItems={'center'}>
                                            <Grid item paddingX={2}>
                                                <AnonymousProfilePic style={{ width: '40px', height: 'auto' }} />
                                            </Grid>
                                            <Grid item paddingX={2}>username</Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item paddingX={2}>Logout</Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Container>
                    <Grid container padding={2} justifyContent={'center'} alignItems={'center'} direction={'column'}>
                        <Grid item>
                            <Grid container spacing={3} alignItems={'center'}>
                                <Grid item xs={4}>
                                    <TextField
                                        variant='outlined'
                                        label='Version'
                                        type='text'
                                        color='primary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        variant='outlined'
                                        label='Book'
                                        type='text'
                                        color='primary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        variant='outlined'
                                        label='Chapter'
                                        type='text'
                                        color='primary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        variant='outlined'
                                        label='Verse(s)'
                                        type='text'
                                        color='primary'
                                        fullWidth
                                        inputProps={{
                                            style: { height: '100%' }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            Output
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
}