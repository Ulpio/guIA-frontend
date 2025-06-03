import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants.js';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adiciona token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log da requisição em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - trata respostas e erros
api.interceptors.response.use(
  (response) => {
    // Log da resposta em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Log do erro em desenvolvimento
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    
    // Se token expirou (401), limpar storage e redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      // Redirecionar para login apenas se não estiver já na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Funções utilitárias para diferentes tipos de requisição
export const apiRequest = {
  // GET
  get: (url, config = {}) => api.get(url, config),
  
  // POST
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // DELETE
  delete: (url, config = {}) => api.delete(url, config),
  
  // PATCH
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  
  // Upload de arquivo
  upload: (url, formData, config = {}) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });
  },
  
  // Download de arquivo
  download: (url, config = {}) => {
    return api.get(url, {
      ...config,
      responseType: 'blob',
    });
  },
};

// Funções específicas da API

// ==================== AUTENTICAÇÃO ====================
export const authAPI = {
  // Registro
  register: (userData) => apiRequest.post('/auth/register', userData),
  
  // Login
  login: (credentials) => apiRequest.post('/auth/login', credentials),
  
  // Logout
  logout: () => apiRequest.post('/auth/logout'),
  
  // Refresh token
  refreshToken: (refreshToken) => apiRequest.post('/auth/refresh', { refresh_token: refreshToken }),
  
  // Validar token
  validateToken: () => apiRequest.get('/auth/validate'),
};

// ==================== USUÁRIOS ====================
export const userAPI = {
  // Perfil atual
  getProfile: () => apiRequest.get('/users/profile'),
  
  // Atualizar perfil
  updateProfile: (profileData) => apiRequest.put('/users/profile', profileData),
  
  // Buscar usuário por ID
  getUserById: (userId) => apiRequest.get(`/users/${userId}`),
  
  // Buscar usuários
  searchUsers: (query, limit = 20, offset = 0) => 
    apiRequest.get('/users/search', { 
      params: { q: query, limit, offset } 
    }),
  
  // Seguir usuário
  followUser: (userId) => apiRequest.post(`/users/${userId}/follow`),
  
  // Deixar de seguir usuário
  unfollowUser: (userId) => apiRequest.delete(`/users/${userId}/unfollow`),
  
  // Seguidores
  getFollowers: (userId, limit = 20, offset = 0) => 
    apiRequest.get(`/users/${userId}/followers`, { 
      params: { limit, offset } 
    }),
  
  // Seguindo
  getFollowing: (userId, limit = 20, offset = 0) => 
    apiRequest.get(`/users/${userId}/following`, { 
      params: { limit, offset } 
    }),
  
  // Alterar senha
  changePassword: (passwordData) => apiRequest.put('/users/change-password', passwordData),
  
  // Desativar conta
  deactivateAccount: () => apiRequest.delete('/users/deactivate'),
};

// ==================== POSTS ====================
export const postAPI = {
  // Feed
  getFeed: (limit = 20, offset = 0) => 
    apiRequest.get('/posts', { 
      params: { limit, offset } 
    }),
  
  // Criar post
  createPost: (postData) => apiRequest.post('/posts', postData),
  
  // Buscar post por ID
  getPostById: (postId) => apiRequest.get(`/posts/${postId}`),
  
  // Atualizar post
  updatePost: (postId, postData) => apiRequest.put(`/posts/${postId}`, postData),
  
  // Deletar post
  deletePost: (postId) => apiRequest.delete(`/posts/${postId}`),
  
  // Curtir post
  likePost: (postId) => apiRequest.post(`/posts/${postId}/like`),
  
  // Descurtir post
  unlikePost: (postId) => apiRequest.delete(`/posts/${postId}/like`),
  
  // Posts por autor
  getPostsByAuthor: (authorId, limit = 20, offset = 0) => 
    apiRequest.get('/posts/author', { 
      params: { authorId, limit, offset } 
    }),
  
  // Buscar posts
  searchPosts: (query, limit = 20, offset = 0) => 
    apiRequest.get('/posts/search', { 
      params: { q: query, limit, offset } 
    }),
  
  // Posts em alta
  getTrendingPosts: (limit = 20, offset = 0) => 
    apiRequest.get('/posts/trending', { 
      params: { limit, offset } 
    }),
};

// ==================== ROTEIROS ====================
export const itineraryAPI = {
  // Listar roteiros
  getItineraries: (filters = {}) => 
    apiRequest.get('/itineraries', { params: filters }),
  
  // Criar roteiro
  createItinerary: (itineraryData) => apiRequest.post('/itineraries', itineraryData),
  
  // Buscar roteiro por ID
  getItineraryById: (itineraryId) => apiRequest.get(`/itineraries/${itineraryId}`),
  
  // Atualizar roteiro
  updateItinerary: (itineraryId, itineraryData) => 
    apiRequest.put(`/itineraries/${itineraryId}`, itineraryData),
  
  // Deletar roteiro
  deleteItinerary: (itineraryId) => apiRequest.delete(`/itineraries/${itineraryId}`),
  
  // Avaliar roteiro
  rateItinerary: (itineraryId, ratingData) => 
    apiRequest.post(`/itineraries/${itineraryId}/rate`, ratingData),
  
  // Atualizar avaliação
  updateRating: (itineraryId, ratingData) => 
    apiRequest.put(`/itineraries/${itineraryId}/rate`, ratingData),
  
  // Deletar avaliação
  deleteRating: (itineraryId) => apiRequest.delete(`/itineraries/${itineraryId}/rate`),
  
  // Buscar roteiros
  searchItineraries: (query, limit = 20, offset = 0) => 
    apiRequest.get('/itineraries/search', { 
      params: { q: query, limit, offset } 
    }),
  
  // Roteiros por autor
  getItinerariesByAuthor: (authorId, limit = 20, offset = 0) => 
    apiRequest.get('/itineraries/author', { 
      params: { authorId, limit, offset } 
    }),
  
  // Roteiros similares
  getSimilarItineraries: (itineraryId, limit = 5) => 
    apiRequest.get(`/itineraries/${itineraryId}/similar`, { 
      params: { limit } 
    }),
};

// ==================== MÍDIA ====================
export const mediaAPI = {
  // Upload de imagem
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest.upload('/media/upload/image', formData);
  },
  
  // Upload de vídeo
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest.upload('/media/upload/video', formData);
  },
  
  // Upload múltiplo
  uploadMultiple: (files, type = null) => {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    if (type) {
      formData.append('type', type);
    }
    
    return apiRequest.upload('/media/upload/multiple', formData);
  },
  
  // Deletar mídia
  deleteMedia: (filePath) => apiRequest.delete('/media/delete', { data: { file_path: filePath } }),
  
  // Informações da mídia
  getMediaInfo: (filePath) => 
    apiRequest.get('/media/info', { params: { file_path: filePath } }),
};

// Funções utilitárias para tratamento de erros
export const handleAPIError = (error) => {
  if (error.response) {
    // Erro da API (resposta com status de erro)
    const { status, data } = error.response;
    
    return {
      status,
      message: data?.message || data?.error || 'Erro no servidor',
      details: data,
    };
  } else if (error.request) {
    // Erro de rede (sem resposta)
    return {
      status: 0,
      message: 'Erro de conexão. Verifique sua internet.',
      details: null,
    };
  } else {
    // Outro tipo de erro
    return {
      status: -1,
      message: error.message || 'Erro desconhecido',
      details: null,
    };
  }
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  return !!token;
};

// Função para obter dados do usuário do localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Função para limpar dados de autenticação
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Exportar todas as APIs
// export {
//   authAPI,
//   userAPI,
//   postAPI,
//   itineraryAPI,
//   mediaAPI,
//   handleAPIError,
//   isAuthenticated,
//   getCurrentUser,
//   clearAuth
// };

// Exportar instância do axios como default
export default api;