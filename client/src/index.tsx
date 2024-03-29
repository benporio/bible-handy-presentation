import React from 'react';
import ReactDOM from 'react-dom/client';
import './asset/css/index.css';
import App from './containers/App';
import reportWebVitals from './reportWebVitals';
import 'tachyons';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { commonTheme } from './themes/commonTheme';
import { Pages } from './app/pages';
import { StartingPage } from './pages/StartingPage/StartingPage';
import { Provider } from 'react-redux';
import { store } from './app/store'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
    
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={commonTheme}>
                <CssBaseline />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<App />} >
                            {Pages.filter(item => item.context === 'app').map(item => <Route key={item.id} path={item.route} element={item.page} />)}
                            </Route>
                        </Routes>
                        <Routes>
                            <Route path="/app" element={<StartingPage />} >
                            {Pages.filter(item => item.label === 'App')[0]
                                .subPages?.map(item => <Route  key={item.id} path={item.route} element={item.page} />)}
                            </Route>
                        </Routes>
                    </BrowserRouter>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
        
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
        