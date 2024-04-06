import React, { useEffect } from 'react';
import '../asset/css/App.css';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { commonTheme } from '../themes/commonTheme';
import { Outlet, useNavigate } from 'react-router';
import { AlertProvider } from '../contexts/AlertContext';

const App: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/auth');
    }, [])
    return (
        <ThemeProvider theme={commonTheme}>
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
    