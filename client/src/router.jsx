import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthGuard from './components/auth/AuthGuard';
import AppLayout from './components/layout/AppLayout';
import LoadingScreen from './components/shared/LoadingScreen';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Application router with lazy loading, auth guards, and animations
 */
const AppRouter = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected Routes */}
            <Route
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRouter;
