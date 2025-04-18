import { ProtectedRoute } from "../contexts/AuthContext/ProtectedRoute";
import { About } from "../pages/About/About";
import { Authentication } from "../pages/Authentication/Authentication";
import { Contact } from "../pages/Contact/Contact";
import { Home } from "../pages/Home/Home";
import { Remote } from "../pages/Remote/Remote";
import { StartingPage } from "../pages/StartingPage/StartingPage";

export type Route = 'bhp' | 'auth' | 'login' | 'register' | 'home' | 'contact' | 'about' | 'remote'
export type RouteLabel = 'Bible Handy Presentation' | 'Authentication' | 'Login' | 'Register' | 'Home' | 'Contact' | 'About' | 'Remote'
export type RouteContext = 'auth' | 'startingPage' | 'bhp'

export const loginRoute = '/auth/login';
export const registerRoute = '/auth/register';
export const homeRoute = '/bhp/home';
export const contactRoute = '/bhp/contact';
export const aboutRoute = '/bhp/about';

export type PageComponent = {
    id: number,
    label: RouteLabel,
    route: Route,
    page: JSX.Element,
    context: RouteContext,
    subPages?: PageComponent[],
    pathName?: string
}

const protectRoute = (children: React.ReactNode) => {
    return (
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}

export const Pages: PageComponent[] = [
    {
        id: 0,
        label: 'Authentication',
        route: 'auth',
        page: <Authentication />,
        context: 'auth',
        subPages : [
            {
                id: 0.1,
                label: 'Login',
                route: 'login',
                page: <Authentication />,
                context: 'auth',
                pathName: loginRoute,
            },
            {
                id: 0.2,
                label: 'Register',
                route: 'register',
                page: <Authentication />,
                context: 'auth',
                pathName: registerRoute,
            },
        ]
    },
    {
        id: 1,
        label: 'Bible Handy Presentation',
        route: 'bhp',
        page: <StartingPage />,
        context: 'bhp',
        subPages : [
            {
                id: 1.1,
                label: 'Home',
                route: 'home',
                page: protectRoute(<Home />),
                context: 'startingPage',
                pathName: homeRoute,
            },
            {
                id: 1.2,
                label: 'Contact',
                route: 'contact',
                page: protectRoute(<Contact />),
                context: 'startingPage',
                pathName: contactRoute,
            },
            {
                id: 1.3,
                label: 'About',
                route: 'about',
                page: protectRoute(<About />),
                context: 'startingPage',
                pathName: aboutRoute,
            },
        ]
    },
    {
        id: 2,
        label: 'Remote',
        route: 'remote',
        page: <Remote />,
        context: 'bhp',
    },
]