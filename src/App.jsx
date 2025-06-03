import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, PublicRoute } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Importar estilos
import './styles/global.css';
import './styles/loading.css';
import './styles/toast.css';
import './styles/layout.css';
import './styles/auth.css';

// Importar páginas
import LoginPage from './pages/LoadingPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import {
  ProfilePage,
  UserProfilePage,
  PostDetailPage,
  ItinerariesPage,
  ItineraryDetailPage,
  CreateItineraryPage,
  SearchPage,
  SettingsPage,
  FollowersPage,
  FollowingPage,
  NotFoundPage
} from './pages/PlaceholderPages';

// Importar componentes de layout
import Layout from './components/Layout';

// Importar constantes
import { ROUTES } from './utils/constants';

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rotas públicas (redireciona se autenticado) */}
              <Route 
                path={ROUTES.LOGIN} 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path={ROUTES.REGISTER} 
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } 
              />

              {/* Rotas protegidas (requer autenticação) */}
              <Route 
                path={ROUTES.HOME} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <HomePage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path={ROUTES.PROFILE} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProfilePage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.USER_PROFILE} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UserProfilePage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.POST_DETAIL} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PostDetailPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.ITINERARIES} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ItinerariesPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.ITINERARY_DETAIL} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ItineraryDetailPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.CREATE_ITINERARY} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateItineraryPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.SEARCH} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SearchPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.SETTINGS} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.FOLLOWERS} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FollowersPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path={ROUTES.FOLLOWING} 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <FollowingPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Página 404 */}
              <Route 
                path="/404" 
                element={<NotFoundPage />} 
              />

              {/* Redirecionar qualquer rota inválida para 404 */}
              <Route 
                path="*" 
                element={<Navigate to="/404" replace />} 
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </div>
  );
}

export default App;