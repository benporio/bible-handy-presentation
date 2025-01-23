import React from 'react';
import '../asset/css/App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../containers/App';
import { PageComponent, Pages } from './pages';

const renderRoute = (page: PageComponent): React.ReactElement | null => {
    if (!!page.subPages && !!page.subPages.length) {
        return (
            <Route key={page.id} path={page.route} element={page.page}>
                {page.subPages.map(subPage => {
                    return renderRoute(subPage);
                })}
            </Route>
        )
    } 
    return <Route key={page.id} path={page.route} element={page.page} />
}

const AppRoute: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                {Pages.map(page => {
                    return renderRoute(page);
                })}
            </Routes>
        </BrowserRouter>
    );
 }
    
export default AppRoute;