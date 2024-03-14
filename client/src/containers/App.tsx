import React, { useEffect } from 'react';
import '../asset/css/App.css';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
// import { StartingPage } from '../pages/StartingPage/StartingPage';
import { commonTheme } from '../themes/commonTheme';
// import { User } from '../types/User';
// import { Authentication } from '../pages/Authentication/Authentication';
import { Outlet, useNavigate } from 'react-router';

// const user: User = {
//     id: '',
//     email: '',
//     username: '',
//     password: '',
//     uuid: '',
//     isLoggedIn: true
// }

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
    