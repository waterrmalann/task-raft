import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css'

import { ThemeProvider } from '@components/providers/ThemeProvider.tsx';

import PrivateRoute from '@components/wrappers/PrivateRoute.tsx';

import HomePage from './pages/home/HomePage.tsx';
import UserLoginPage from './pages/user/UserLoginPage.tsx';
import UserRegistrationPage from './pages/user/UserRegistrationPage.tsx';
import UserProfilePage from './pages/user/UserProfileSubPage.tsx';
import NotFoundPage from './pages/404/NotFoundPage.tsx';
import UserDashboard from '@pages/user/UserDashboard.tsx';
import UserSettings from '@pages/user/UserSettings.tsx';

import UserProfileSubPage from './pages/user/UserProfileSubPage.tsx';
import UserAccountSubPage from '@pages/user/UserAccountSubPage.tsx';
import UserEmailVerificationPage from '@pages/user/UserEmailVerificationPage.tsx';
import DashboardHomePage from '@pages/dash/DashboardHomePage.tsx';
import BoardViewPage from '@pages/dash/BoardViewPage.tsx';
import InviteAcceptPage from '@pages/dash/InviteAcceptPage.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route index={true} path='/' element={<HomePage />} />
            <Route path='/login' element={<UserLoginPage />} />
            <Route path='/register' element={<UserRegistrationPage />} />
            <Route path="/verify/:code" element={<UserEmailVerificationPage />} />
            
            {/* Private Routes */}
            <Route path='' element={<PrivateRoute />}>
                <Route path="/user" element={<UserSettings />}>
                    <Route index element={<UserProfileSubPage />} />
                    <Route path="account" element={<UserAccountSubPage />} />
                    {/* <Route path="notifications" element={<UserNotificationsSubPage />} /> */}
                    {/* todo: potentially an appearance subpage as well */}
                </Route>
                <Route path='/profile' element={<UserProfilePage />} />
                <Route path="/dash" element={<UserDashboard />}>
                    <Route index element={<DashboardHomePage />} />
                    <Route path="boards/:boardId/invite" element={<InviteAcceptPage />} />
                    <Route path="boards/:boardId" element={<BoardViewPage />} />
                    {/* <Route path="/:" */}
                </Route>
                <Route path='/dash' element={<UserDashboard />} />
            </Route>

            <Route path='*' element={<NotFoundPage />} />
        </Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
