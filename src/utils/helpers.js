import { FILE_UPLOAD, DATE_FORMATS, VALIDATION } from './constants.js';

/**
 * Formata data para exibição
 * @param {string|Date} date - Data para formatar
 * @param {string} format - Formato desejado
 * @returns {string} Data formatada
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return `${day}/${month}/${year}`;
    case DATE_FORMATS.DISPLAY_WITH_TIME:
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case DATE_FORMATS.TIME:
      return `${hours}:${minutes}`;
    case DATE_FORMATS.API:
      return `${year}-${month}-${day}`;
    default:
      return dateObj.toLocaleDateString('pt-BR');
  }
};

/**
 * Calcula tempo relativo (ex: "há 2 horas")
 * @param {string|Date} date - Data para calcular
 * @returns {string} Tempo relativo
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = new Date(date);
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'agora mesmo';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `há ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `há ${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''}`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `há ${diffInYears} ano${diffInYears > 1 ? 's' : ''}`;
};

/**
 * Formata números para exibição (ex: 1.5K, 2.3M)
 * @param {number} num - Número para formatar
 * @returns {string} Número formatado
 */
export const formatNumber = (num) => {
  if (!num || num < 1000) return num?.toString() || '0';
  
  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  if (num < 1000000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  
  return `${(num / 1000000000).toFixed(1)}B`;
};

/**
 * Formata preço para exibição
 * @param {number} price - Preço
 * @param {string} currency - Moeda (padrão: BRL)
 * @returns {string} Preço formatado
 */
export const formatPrice = (price, currency = 'BRL') => {
  if (!price && price !== 0) return '';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

/**
 * Valida email
 * @param {string} email - Email para validar
 * @returns {boolean} Se é válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida username
 * @param {string} username - Username para validar
 * @returns {boolean} Se é válido
 */
export const isValidUsername = (username) => {
  if (!username) return false;
  
  return (
    username.length >= VALIDATION.USERNAME.MIN_LENGTH &&
    username.length <= VALIDATION.USERNAME.MAX_LENGTH &&
    VALIDATION.USERNAME.PATTERN.test(username)
  );
};

/**
 * Valida senha
 * @param {string} password - Senha para validar
 * @returns {boolean} Se é válida
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  
  return (
    password.length >= VALIDATION.PASSWORD.MIN_LENGTH &&
    password.length <= VALIDATION.PASSWORD.MAX_LENGTH
  );
};

/**
 * Valida arquivo de upload
 * @param {File} file - Arquivo para validar
 * @param {string} type - Tipo esperado ('image' ou 'video')
 * @returns {object} Resultado da validação
 */
export const validateFile = (file, type = 'image') => {
  if (!file) {
    return { isValid: false, error: 'Nenhum arquivo selecionado' };
  }
  
  // Verificar tamanho
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    const sizeMB = Math.round(FILE_UPLOAD.MAX_SIZE / (1024 * 1024));
    return { isValid: false, error: `Arquivo muito grande. Máximo: ${sizeMB}MB` };
  }
  
  // Verificar tipo
  const allowedTypes = type === 'image' 
    ? FILE_UPLOAD.ALLOWED_IMAGE_TYPES 
    : FILE_UPLOAD.ALLOWED_VIDEO_TYPES;
    
  if (!allowedTypes.includes(file.type)) {
    const typeLabel = type === 'image' ? 'imagem' : 'vídeo';
    return { isValid: false, error: `Tipo de ${typeLabel} não suportado` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Converte arquivo para base64
 * @param {File} file - Arquivo para converter
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Gera URL temporária para preview de arquivo
 * @param {File} file - Arquivo
 * @returns {string} URL temporária
 */
export const createFilePreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Remove acentos de string
 * @param {string} str - String para normalizar
 * @returns {string} String sem acentos
 */
export const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Converte string para slug (URL-friendly)
 * @param {string} str - String para converter
 * @returns {string} Slug
 */
export const stringToSlug = (str) => {
  return removeAccents(str)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Trunca texto com reticências
 * @param {string} text - Texto para truncar
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || '';
  
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Capitaliza primeira letra
 * @param {string} str - String para capitalizar
 * @returns {string} String capitalizada
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza primeira letra de cada palavra
 * @param {string} str - String para capitalizar
 * @returns {string} String com palavras capitalizadas
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

/**
 * Gera cor baseada em string (para avatars)
 * @param {string} str - String base
 * @returns {string} Cor hexadecimal
 */
export const generateColorFromString = (str) => {
  if (!str) return '#6c757d';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Gera iniciais do nome
 * @param {string} name - Nome completo
 * @returns {string} Iniciais
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Debounce function
 * @param {Function} func - Função para fazer debounce
 * @param {number} delay - Delay em millisegundos
 * @returns {Function} Função com debounce
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Função para fazer throttle
 * @param {number} delay - Delay em millisegundos
 * @returns {Function} Função com throttle
 */
export const throttle = (func, delay) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func.apply(null, args);
  };
};

/**
 * Copia texto para clipboard
 * @param {string} text - Texto para copiar
 * @returns {Promise<boolean>} Se foi copiado com sucesso
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Verifica se dispositivo é mobile
 * @returns {boolean} Se é mobile
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Rola página para elemento
 * @param {string} elementId - ID do elemento
 * @param {object} options - Opções de scroll
 */
export const scrollToElement = (elementId, options = {}) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options,
    });
  }
};

/**
 * Rola página para o topo
 * @param {object} options - Opções de scroll
 */
export const scrollToTop = (options = {}) => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
    ...options,
  });
};

/**
 * Gera ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Converte coordenadas para string de localização
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} String de localização
 */
export const coordsToLocationString = (lat, lng) => {
  if (!lat || !lng) return '';
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

/**
 * Calcula distância entre duas coordenadas (em km)
 * @param {number} lat1 - Latitude 1
 * @param {number} lng1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lng2 - Longitude 2
 * @returns {number} Distância em km
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Formata duração em dias para string legível
 * @param {number} days - Número de dias
 * @returns {string} Duração formatada
 */
export const formatDuration = (days) => {
  if (!days) return '';
  
  if (days === 1) return '1 dia';
  if (days < 7) return `${days} dias`;
  
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  
  let result = '';
  if (weeks === 1) result += '1 semana';
  else if (weeks > 1) result += `${weeks} semanas`;
  
  if (remainingDays > 0) {
    if (result) result += ' e ';
    result += remainingDays === 1 ? '1 dia' : `${remainingDays} dias`;
  }
  
  return result;
};

/**
 * Agrupa array por propriedade
 * @param {Array} array - Array para agrupar
 * @param {string} key - Chave para agrupar
 * @returns {object} Objeto agrupado
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Remove duplicatas de array
 * @param {Array} array - Array com duplicatas
 * @param {string} key - Chave para comparar (opcional)
 * @returns {Array} Array sem duplicatas
 */
export const removeDuplicates = (array, key) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Ordena array por propriedade
 * @param {Array} array - Array para ordenar
 * @param {string} key - Chave para ordenar
 * @param {string} direction - Direção ('asc' ou 'desc')
 * @returns {Array} Array ordenado
 */
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Exporta funções utilitárias como default
 */
export default {
  formatDate,
  getRelativeTime,
  formatNumber,
  formatPrice,
  isValidEmail,
  isValidUsername,
  isValidPassword,
  validateFile,
  fileToBase64,
  createFilePreviewUrl,
  removeAccents,
  stringToSlug,
  truncateText,
  capitalize,
  capitalizeWords,
  generateColorFromString,
  getInitials,
  debounce,
  throttle,
  copyToClipboard,
  isMobile,
  scrollToElement,
  scrollToTop,
  generateId,
  coordsToLocationString,
  calculateDistance,
  formatDuration,
  groupBy,
  removeDuplicates,
  sortBy,
};