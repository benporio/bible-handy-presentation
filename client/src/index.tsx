import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store'
import './asset/css/index.css';
import reportWebVitals from './reportWebVitals';
import 'tachyons';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext/AuthContext';
import AppRoute from './app/Routes';
import { ThemeProvider } from "@mui/material/styles";
import { Helmet } from 'react-helmet-async';
import { CssBaseline } from '@mui/material';
import { commonTheme } from './themes/commonTheme';
import { AlertProvider } from './contexts/AlertContext';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
    
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <AuthProvider>
                <HelmetProvider>
                    <ThemeProvider theme={commonTheme}>
                        <Helmet>
                            <title>Bible Handy Presentation</title>
                        </Helmet>
                        <CssBaseline />
                        <AlertProvider>
                            <AppRoute />
                        </AlertProvider>
                    </ThemeProvider>
                </HelmetProvider>
            </AuthProvider>
        </Provider>
    </React.StrictMode>
);
        
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
        