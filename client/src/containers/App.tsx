import React, { useEffect } from 'react';
import '../asset/css/App.css';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { commonTheme } from '../themes/commonTheme';
import { Outlet, useNavigate } from 'react-router';
import { AlertProvider } from '../contexts/AlertContext';
import { Helmet } from 'react-helmet-async';

const App: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/auth');
    }, [])
    return (
        <ThemeProvider theme={commonTheme}>
            <Helmet>
                <title>Bible Handy Presentation</title>
            </Helmet>
            <CssBaseline />
            <AlertProvider>
                <Box>
                    <Outlet />
                </Box>
            </AlertProvider>
        </ThemeProvider>
    );
 }
    
export default App;
    