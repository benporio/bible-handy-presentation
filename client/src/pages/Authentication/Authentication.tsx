import React, { useState } from 'react'
import { Container, Grid } from '@mui/material';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { RegisterForm } from '../../features/auth/components/RegistrationForm';

interface AuthenticationProps { }

export const Authentication: React.FC<AuthenticationProps> = () => {
    const [ authMethod, setAuthMethod ] = useState('LOGIN');
    return (
        <Container >
            <Grid container padding={5} justifyContent='center'>
                {authMethod === 'LOGIN' ? 
                    <LoginForm setAuthMethod={setAuthMethod} />
                    :
                    <RegisterForm setAuthMethod={setAuthMethod} />
                }
            </Grid>
        </Container>
    );
}
