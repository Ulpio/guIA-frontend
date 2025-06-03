// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'guIA';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'guia_token',
  REFRESH_TOKEN: 'guia_refresh_token',
  USER: 'guia_user',
  THEME: 'guia_theme',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  USER_PROFILE: '/user/:id',
  POSTS: '/posts',
  POST_DETAIL: '/post/:id',
  ITINERARIES: '/itineraries',
  ITINERARY_DETAIL: '/itinerary/:id',
  CREATE_ITINERARY: '/create-itinerary',
  SEARCH: '/search',
  SETTINGS: '/settings',
  FOLLOWERS: '/followers/:id',
  FOLLOWING: '/following/:id',
};

// User Types
export const USER_TYPES = {
  NORMAL: 'normal',
  COMPANY: 'company',
  ADMIN: 'admin',
};

// Post Types
export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
};

// Itinerary Categories
export const ITINERARY_CATEGORIES = {
  ADVENTURE: 'adventure',
  CULTURAL: 'cultural',
  GASTRONOMIC: 'gastronomic',
  NATURE: 'nature',
  URBAN: 'urban',
  BEACH: 'beach',
  MOUNTAIN: 'mountain',
  BUSINESS: 'business',
  FAMILY: 'family',
  ROMANTIC: 'romantic',
};

// Category Labels (for display)
export const CATEGORY_LABELS = {
  [ITINERARY_CATEGORIES.ADVENTURE]: 'Aventura',
  [ITINERARY_CATEGORIES.CULTURAL]: 'Cultural',
  [ITINERARY_CATEGORIES.GASTRONOMIC]: 'Gastronômico',
  [ITINERARY_CATEGORIES.NATURE]: 'Natureza',
  [ITINERARY_CATEGORIES.URBAN]: 'Urbano',
  [ITINERARY_CATEGORIES.BEACH]: 'Praia',
  [ITINERARY_CATEGORIES.MOUNTAIN]: 'Montanha',
  [ITINERARY_CATEGORIES.BUSINESS]: 'Negócios',
  [ITINERARY_CATEGORIES.FAMILY]: 'Família',
  [ITINERARY_CATEGORIES.ROMANTIC]: 'Romântico',
};

// Location Types
export const LOCATION_TYPES = {
  HOTEL: 'hotel',
  RESTAURANT: 'restaurant',
  ATTRACTION: 'attraction',
  TRANSPORT: 'transport',
  SHOPPING: 'shopping',
  OTHER: 'other',
};

// Location Type Labels
export const LOCATION_TYPE_LABELS = {
  [LOCATION_TYPES.HOTEL]: 'Hotel',
  [LOCATION_TYPES.RESTAURANT]: 'Restaurante',
  [LOCATION_TYPES.ATTRACTION]: 'Atração',
  [LOCATION_TYPES.TRANSPORT]: 'Transporte',
  [LOCATION_TYPES.SHOPPING]: 'Compras',
  [LOCATION_TYPES.OTHER]: 'Outro',
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  MAX_FILES_MULTIPLE: 10,
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
};

// Validation
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  POST_CONTENT: {
    MAX_LENGTH: 2000,
  },
  ITINERARY_TITLE: {
    MAX_LENGTH: 200,
  },
  ITINERARY_DESCRIPTION: {
    MAX_LENGTH: 5000,
  },
  LOCATION_NAME: {
    MAX_LENGTH: 200,
  },
  RATING: {
    MIN: 1,
    MAX: 5,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  PASSWORD_TOO_SHORT: `Senha deve ter pelo menos ${VALIDATION.PASSWORD.MIN_LENGTH} caracteres`,
  USERNAME_INVALID: 'Nome de usuário deve conter apenas letras, números e underscore',
  USERNAME_TOO_SHORT: `Nome de usuário deve ter pelo menos ${VALIDATION.USERNAME.MIN_LENGTH} caracteres`,
  PASSWORDS_DONT_MATCH: 'Senhas não coincidem',
  FILE_TOO_LARGE: 'Arquivo muito grande',
  INVALID_FILE_TYPE: 'Tipo de arquivo não permitido',
  NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
  GENERIC_ERROR: 'Algo deu errado. Tente novamente.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'Conta criada com sucesso!',
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  POST_CREATED: 'Post criado com sucesso!',
  POST_UPDATED: 'Post atualizado com sucesso!',
  POST_DELETED: 'Post deletado com sucesso!',
  ITINERARY_CREATED: 'Roteiro criado com sucesso!',
  ITINERARY_UPDATED: 'Roteiro atualizado com sucesso!',
  ITINERARY_DELETED: 'Roteiro deletado com sucesso!',
  FOLLOW_SUCCESS: 'Usuário seguido com sucesso!',
  UNFOLLOW_SUCCESS: 'Deixou de seguir o usuário!',
  LIKE_SUCCESS: 'Post curtido!',
  UNLIKE_SUCCESS: 'Curtida removida!',
  RATING_SUCCESS: 'Avaliação enviada com sucesso!',
  FILE_UPLOADED: 'Arquivo enviado com sucesso!',
};

// Theme
export const THEME = {
  COLORS: {
    PRIMARY: '#007bff',
    SECONDARY: '#6c757d',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40',
  },
  BREAKPOINTS: {
    XS: '0px',
    SM: '576px',
    MD: '768px',
    LG: '992px',
    XL: '1200px',
    XXL: '1400px',
  },
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
};

// Map Configuration (for future implementation)
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: -23.5505,
    lng: -46.6333, // São Paulo
  },
  DEFAULT_ZOOM: 10,
};

export default {
  API_BASE_URL,
  APP_NAME,
  APP_VERSION,
  STORAGE_KEYS,
  ROUTES,
  USER_TYPES,
  POST_TYPES,
  ITINERARY_CATEGORIES,
  CATEGORY_LABELS,
  LOCATION_TYPES,
  LOCATION_TYPE_LABELS,
  FILE_UPLOAD,
  PAGINATION,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  THEME,
  DATE_FORMATS,
  MAP_CONFIG,
};