import React, { useEffect } from 'react';
import '../asset/css/App.css';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { commonTheme } from '../themes/commonTheme';
import { Outlet, useNavigate } from 'react-router';

const App: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/auth');
    }, [])
    return (
        <ThemeProvider theme={commonTheme}>
            <CssBaseline />
            <Box>
                <Outlet />
            </Box>
        </ThemeProvider>
    );
 }
    
export default App;
    