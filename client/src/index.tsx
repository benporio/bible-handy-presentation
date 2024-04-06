import React from 'react';
import ReactDOM from 'react-dom/client';
import './asset/css/index.css';
import App from './containers/App';
import reportWebVitals from './reportWebVitals';
import 'tachyons';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Pages } from './app/pages';
import { Provider } from 'react-redux';
import { store } from './app/store'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
    
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} >
                        {Pages.map(page => {
                            if (!!page.subPages && !!page.subPages.length) {
                                return (
                                    <Route key={page.id} path={page.route} element={page.page}>
                                        {page.subPages.map(subPage => {
                                            return <Route key={subPage.id} path={subPage.route} element={subPage.page} />
                                        })}
                                    </Route>
                                )
                            } 
                            return <Route key={page.id} path={page.route} element={page.page} />
                        })}
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
        
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
        