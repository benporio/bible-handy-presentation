import { About } from "../pages/About/About";
import { Authentication } from "../pages/Authentication/Authentication";
import { Contact } from "../pages/Contact/Contact";
import { Home } from "../pages/Home/Home";
import { StartingPage } from "../pages/StartingPage/StartingPage";

export type PageComponent = {
    id: number,
    label: string,
    route: string,
    page: JSX.Element,
    context: 'app' | 'auth' | 'startingPage',
    subPages?: PageComponent[]
}

export const Pages: PageComponent[] = [
    {
        id: 0,
        label: 'Authentication',
        route: 'auth',
        page: <Authentication />,
        context: 'app',
        subPages : [
            {
                id: 0.1,
                label: 'Login',
                route: 'login',
                page: <Authentication />,
                context: 'auth',
            },
            {
                id: 0.2,
                label: 'Register',
                route: 'register',
                page: <Authentication />,
                context: 'auth',
            },
        ]
    },
    {
        id: 1,
        label: 'App',
        route: 'app',
        page: <StartingPage />,
        context: 'app',
        subPages : [
            {
                id: 1.1,
                label: 'Home',
                route: 'home',
                page: <Home />,
                context: 'startingPage',
            },
            {
                id: 1.2,
                label: 'Contact',
                route: 'contact',
                page: <Contact />,
                context: 'startingPage',
            },
            {
                id: 1.3,
                label: 'About',
                route: 'about',
                page: <About />,
                context: 'startingPage',
            },
        ]
    },
]