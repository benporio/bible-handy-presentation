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
                borderBottom: '1px solid #26323E',
                backgroundColor: '#101418',
                zIndex: 10,
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
            <Grid item padding={2}>
                <Container style={{ width: '70%' }}>
                    <Grid container rowGap={3} justifyContent={'center'} alignItems={'center'} direction={'row'}>
                        <Grid item xs={12} style={{  width: '100%' }}>
                            <Grid container columnSpacing={3} alignItems={'center'}>
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
                                            style: { height: '100%' },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} padding={3} className='primary' style={{ height: '500px', width: '100%' }}>
                            <Grid container alignItems={'center'} justifyContent={'center'} style={{ height: '100%', width: '100%' }}>
                                <Grid item className='tc'>
                                    <sup className='f3 mr2' style={{ verticalAlign: 'super' }}>4</sup><span className='f1'>
                                        Take delight in the Lord,
                                        and he will give you 
                                        the desires of your heart.
                                    </span>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
}