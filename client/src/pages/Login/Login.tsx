import React from 'react'
import { Container, Grid } from '@mui/material';
import { AppLogo } from '../../asset/asset';
import { InputBox } from '../../components/common/InputBox/InputBox';

interface LoginProps { }

export const Login: React.FC<LoginProps> = () => {
    return (
        <Container >
            <Grid container  justifyContent={'center'}>
                <Grid item padding={5}>
                    <div style={{ border: '1px solid #0094FF',  borderRadius: '16px', backgroundColor: '#060E0F', height: '600px', width: '700px' }}>
                        <Grid container justifyContent={'center'} alignItems={'center'} height={'100%'} direction={'column'}>
                            <Grid item>
                                <AppLogo style={{ width: '400px', height: 'auto' }} />
                            </Grid>
                            <Grid item>
                                <InputBox label='USERNAME'/>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}
