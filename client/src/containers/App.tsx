import React from 'react';
import '../asset/css/App.css';
import { Box } from '@mui/material';
import { Outlet } from 'react-router';

const App: React.FC = () => {
    return (
        <Box>
            <Outlet />
        </Box>
    );
}
    
export default App;