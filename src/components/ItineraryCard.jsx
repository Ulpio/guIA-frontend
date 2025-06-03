import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiClock, 
  FiStar, 
  FiEye, 
  FiCalendar,
  FiDollarSign,
  FiUsers
} from 'react-icons/fi';
import { ROUTES, CATEGORY_LABELS } from '../utils/constants';
import { 
  formatPrice, 
  formatNumber, 
  formatDuration,
  getInitials,
  generateColorFromString,
  truncateText
} from '../utils/helpers';

const ItineraryCard = ({ itinerary, compact = false }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      adventure: '🏔️',
      cultural: '🏛️',
      gastronomic: '🍽️',
      nature: '🌿',
      urban: '🏙️',
      beach: '🏖️',
      mountain: '⛰️',
      business: '💼',
      family: '👨‍👩‍👧‍👦',
      romantic: '💕'
    };
    return icons[category] || '📍';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      1: '#28a745', // Verde
      2: '#6f42c1', // Roxo
      3: '#fd7e14', // Laranja
      4: '#dc3545', // Vermelho
      5: '#6f1d1d'  // Vermelho escuro
    };
    return colors[difficulty] || '#6c757d';
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      1: 'Muito Fácil',
      2: 'Fácil',
      3: 'Moderado',
      4: 'Difícil',
      5: 'Muito Difícil'
    };
    return labels[difficulty] || 'Não definido';
  };

  return (
    <article className={`itinerary-card ${compact ? 'itinerary-card-compact' : ''}`}>
      <Link 
        to={ROUTES.ITINERARY_DETAIL.replace(':id', itinerary.id)}
        className="itinerary-card-link"
      >
        {/* Imagem de capa */}
        <div className="itinerary-cover">
          {itinerary.cover_image ? (
            <img 
              src={itinerary.cover_image} 
              alt={itinerary.title}
              className="itinerary-cover-image"
            />
          ) : (
            <div className="itinerary-cover-placeholder">
              <span className="itinerary-cover-icon">
                {getCategoryIcon(itinerary.category)}
              </span>
            </div>
          )}
          
          {/* Badge de categoria */}
          <div className="itinerary-category-badge">
            <span className="itinerary-category-icon">
              {getCategoryIcon(itinerary.category)}
            </span>
            <span className="itinerary-category-text">
              {CATEGORY_LABELS[itinerary.category]}
            </span>
          </div>

          {/* Badge de featured */}
          {itinerary.is_featured && (
            <div className="itinerary-featured-badge">
              <FiStar />
              Featured
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="itinerary-content">
          {/* Header */}
          <div className="itinerary-header">
            <h3 className="itinerary-title">
              {truncateText(itinerary.title, compact ? 50 : 80)}
            </h3>
            
            <div className="itinerary-location">
              <FiMapPin />
              <span>
                {itinerary.city && itinerary.country 
                  ? `${itinerary.city}, ${itinerary.country}`
                  : itinerary.country || 'Local não especificado'
                }
              </span>
            </div>
          </div>

          {/* Descrição (apenas se não for compact) */}
          {!compact && itinerary.description && (
            <p className="itinerary-description">
              {truncateText(itinerary.description, 120)}
            </p>
          )}

          {/* Informações principais */}
          <div className="itinerary-info">
            <div className="itinerary-info-item">
              <FiCalendar className="itinerary-info-icon" />
              <span>{formatDuration(itinerary.duration)}</span>
            </div>

            <div className="itinerary-info-item">
              <div 
                className="itinerary-difficulty"
                style={{ color: getDifficultyColor(itinerary.difficulty) }}
              >
                <span className="itinerary-difficulty-dots">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span 
                      key={i}
                      className={`itinerary-difficulty-dot ${
                        i < itinerary.difficulty ? 'active' : ''
                      }`}
                    />
                  ))}
                </span>
                <span className="itinerary-difficulty-label">
                  {getDifficultyLabel(itinerary.difficulty)}
                </span>
              </div>
            </div>

            {itinerary.estimated_cost && (
              <div className="itinerary-info-item">
                <FiDollarSign className="itinerary-info-icon" />
                <span>
                  {formatPrice(itinerary.estimated_cost, itinerary.currency)}
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="itinerary-stats">
            <div className="itinerary-stat">
              <FiStar className="itinerary-stat-icon" />
              <span>{itinerary.average_rating?.toFixed(1) || '0.0'}</span>
              <span className="itinerary-stat-count">
                ({formatNumber(itinerary.ratings_count)})
              </span>
            </div>

            <div className="itinerary-stat">
              <FiEye className="itinerary-stat-icon" />
              <span>{formatNumber(itinerary.views_count)}</span>
            </div>
          </div>

          {/* Autor (apenas se não for compact) */}
          {!compact && itinerary.author && (
            <div className="itinerary-author">
              {itinerary.author.profile_picture ? (
                <img 
                  src={itinerary.author.profile_picture} 
                  alt={itinerary.author.first_name}
                  className="itinerary-author-avatar"
                />
              ) : (
                <div 
                  className="itinerary-author-avatar itinerary-author-avatar-fallback"
                  style={{ 
                    backgroundColor: generateColorFromString(
                      itinerary.author.username || ''
                    ) 
                  }}
                >
                  {getInitials(
                    `${itinerary.author.first_name} ${itinerary.author.last_name}`
                  )}
                </div>
              )}
              
              <div className="itinerary-author-info">
                <span className="itinerary-author-name">
                  {itinerary.author.first_name} {itinerary.author.last_name}
                </span>
                <span className="itinerary-author-username">
                  @{itinerary.author.username}
                </span>
              </div>

              {itinerary.author.user_type === 'company' && (
                <div className="itinerary-author-badge">
                  <FiUsers />
                  Empresa
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ItineraryCard;