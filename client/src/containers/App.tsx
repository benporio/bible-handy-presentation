import React from 'react';
import '../asset/css/App.css';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { Home } from '../pages/Home/Home';
import { commonTheme } from '../themes/commonTheme';
import { User } from '../types/User';
import { Outlet } from 'react-router-dom';

const user: User = {
    id: '',
    email: '',
    username: '',
    password: '',
    uuid: '',
    isLoggedIn: false
}

const App: React.FC = () => {
    return (
        <ThemeProvider theme={commonTheme}>
            <CssBaseline />
            <Box>
                {user.isLoggedIn ? <Home /> : <Outlet  />}
            </Box>
        </ThemeProvider>
    );
 }
    
export default App;
    