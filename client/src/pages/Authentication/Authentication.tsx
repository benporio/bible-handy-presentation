import React, { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { RegisterForm } from '../../features/auth/components/RegistrationForm';
import { useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom'

interface AuthenticationProps { }

export const Authentication: React.FC<AuthenticationProps> = () => {
    const auth = useAppSelector((state) => state.auth);
    
    const navigate = useNavigate();
    useEffect(() => {
        console.log(auth)
        if (auth.isLoggedIn) {
            navigate('/app');
        }
    }, [auth])
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
