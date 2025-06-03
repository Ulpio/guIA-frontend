import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, userAPI, clearAuth, getCurrentUser, isAuthenticated } from '../services/api.js';
import { STORAGE_KEYS } from '../utils/constants.js';

// Estado inicial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Tipos de ação
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Criar contexto
const AuthContext = createContext(null);

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const user = getCurrentUser();

        if (token && user) {
          // Verificar se o token ainda é válido
          try {
            const response = await authAPI.validateToken();
            
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: response.data.data,
                token,
              },
            });
          } catch (error) {
            // Token inválido, limpar dados
            clearAuth();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        clearAuth();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.login(credentials);
      const { token, refresh_token, user } = response.data.data;

      // Salvar no localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token,
        },
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.register(userData);
      const { token, refresh_token, user } = response.data.data;

      // Salvar no localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token,
        },
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
      
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      // Tentar fazer logout no servidor
      await authAPI.logout();
    } catch (error) {
      // Ignorar erros de logout no servidor
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      // Sempre limpar dados locais
      clearAuth();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    
    // Atualizar no localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  };

  // Função para atualizar perfil
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await userAPI.updateProfile(profileData);
      const updatedUser = response.data.data;

      updateUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil';
      
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Função para alterar senha
  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      await userAPI.changePassword(passwordData);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao alterar senha';
      
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Função para limpar erro
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Função para verificar se o usuário tem determinada permissão
  const hasPermission = (permission) => {
    if (!state.user) return false;
    
    // Implementar lógica de permissões conforme necessário
    switch (permission) {
      case 'admin':
        return state.user.user_type === 'admin';
      case 'company':
        return state.user.user_type === 'company' || state.user.user_type === 'admin';
      default:
        return true;
    }
  };

  // Função para verificar se é o próprio usuário
  const isOwnProfile = (userId) => {
    return state.user?.id === userId;
  };

  // Valor do contexto
  const value = {
    // Estado
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Funções
    login,
    register,
    logout,
    updateUser,
    updateProfile,
    changePassword,
    clearError,
    hasPermission,
    isOwnProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
};

// Componente para proteger rotas
export const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionar para login
    window.location.href = '/login';
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return children;
};

// Componente para rotas públicas (redireciona se autenticado)
export const PublicRoute = ({ children, redirectTo = '/' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    window.location.href = redirectTo;
    return null;
  }

  return children;
};

export default AuthContext;