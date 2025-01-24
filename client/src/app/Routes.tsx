import React from 'react';
import '../asset/css/App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
                {Pages.map(page => {
                    return renderRoute(page);
                })}
                <Route path="*" element={<Navigate to="/auth/login" />} />
            </Routes>
        </BrowserRouter>
    );
 }
    
export default AppRoute;