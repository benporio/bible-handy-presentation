import React from 'react'
import { Button, Container, Grid, TextField } from '@mui/material';
import { AppLogo } from '../../asset/asset';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { Pages } from '../../app/Pages';

interface LoginProps { }

export const Login: React.FC<LoginProps> = () => {
    const navigate = useNavigate();
    return (
        <Container >
            <Grid container padding={5} justifyContent='center'>
                <Grid item style={{ border: '1px solid #0094FF',  borderRadius: '16px', backgroundColor: '#060E0F', height: '600px', width: '700px' }}>
                    <Grid container direction='column' justifyContent='flex-end' height='100%' margin={0} padding={2} >
                        <Grid item alignSelf='center' marginBottom='auto' marginTop='auto'>
                            <Grid container spacing={4} justifyContent='center' height='auto' alignItems='center' direction='column'>
                                <Grid item>
                                    <AppLogo style={{ width: '400px', height: 'auto' }} />
                                </Grid>
                                <Grid item>
                                    <Grid container direction='column'>
                                        <Grid item>
                                            <TextField
                                            variant='outlined'
                                                margin="dense"
                                                label='USERNAME'
                                                type='text'
                                                color='primary'
                                                inputProps={{
                                                    style: { height: '100%' }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                margin="dense"
                                                label='PASSWORD'
                                                type='password'
                                                color='primary'
                                                inputProps={{
                                                    style: { height: '100%' }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Button color='primary' variant='contained' size='medium' autoFocus={false}>
                                        <span className='b f4'>SIGN IN</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item alignSelf='flex-end'>
                            <Button endIcon={<FontAwesomeIcon icon={faCircleChevronRight} />} className='br2' 
                                color='secondary' variant='contained' size='small' autoFocus={false}
                                onClick={() => navigate(Pages.filter(page => page.route === '/register')[0].route)}>
                                <span className='b'>SIGN UP</span>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
