import { Container, Grid } from '@mui/material';
import React from 'react';

interface ContactProps { }

export const Contact: React.FC<ContactProps> = () => {
    return (
        <Container style={{ width: '70%' }}>
            <Grid container alignItems={'center'} justifyContent={'center'} style={{ height: '100%', width: '100%' }}>
                <Grid item className='tc'>
                    <span className='f1'>
                        Contact Page
                    </span>
                </Grid>
            </Grid>
        </Container>
    );
}