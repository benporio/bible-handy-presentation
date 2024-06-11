import React, {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import { Provider } from 'react-redux';
import { store } from '../app/store'
import { ThemeProvider } from "@mui/material/styles";
import { commonTheme } from '../themes/commonTheme';
import { AlertProvider } from '../contexts/AlertContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Pages } from '../app/pages';

const AllTheProviders = ({children}: {children: React.ReactNode}) => {
    const App = (
        <ThemeProvider theme={commonTheme}>
            <AlertProvider>
                {children}
            </AlertProvider>
        </ThemeProvider>
    )
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={App} >
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
    )
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'
export {customRender as render}