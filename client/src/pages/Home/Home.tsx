import { Container, Grid, TextField } from '@mui/material';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Logger from '../../utils/Logger';

interface HomeProps { }

export const Home: React.FC<HomeProps> = () => {
    Logger.debug('rendering Home...')
    return (
        <Container style={{ width: '70%' }}>
            <Helmet>
                <title>BHP | Home</title>
            </Helmet>
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
    );
}