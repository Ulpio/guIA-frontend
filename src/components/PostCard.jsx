import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiMessageCircle, 
  FiShare2, 
  FiMoreHorizontal,
  FiMapPin,
  FiEdit3,
  FiTrash2,
  FiFlag
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { postAPI } from '../services/api';
import { LoadingSpinner } from './Loading';
import { ROUTES } from '../utils/constants';
import { 
  getRelativeTime, 
  formatNumber, 
  getInitials, 
  generateColorFromString,
  truncateText
} from '../utils/helpers';

const PostCard = ({ post, onUpdate, onDelete, compact = false }) => {
  const { user, isOwnProfile } = useAuth();
  const { success, error } = useToast();
  
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localPost, setLocalPost] = useState(post);

  const isOwner = isOwnProfile(post.author_id);

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      
      if (localPost.is_liked) {
        await postAPI.unlikePost(localPost.id);
        setLocalPost(prev => ({
          ...prev,
          is_liked: false,
          likes_count: prev.likes_count - 1
        }));
      } else {
        await postAPI.likePost(localPost.id);
        setLocalPost(prev => ({
          ...prev,
          is_liked: true,
          likes_count: prev.likes_count + 1
        }));
      }

      if (onUpdate) onUpdate(localPost);
    } catch (err) {
      console.error('Erro ao curtir post:', err);
      error('Erro ao curtir post');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || isDeleting) return;

    if (!window.confirm('Tem certeza que deseja deletar este post?')) return;

    try {
      setIsDeleting(true);
      await postAPI.deletePost(localPost.id);
      success('Post deletado com sucesso!');
      if (onDelete) onDelete(localPost.id);
    } catch (err) {
      console.error('Erro ao deletar post:', err);
      error('Erro ao deletar post');
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${ROUTES.POST_DETAIL.replace(':id', localPost.id)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post de ${localPost.author?.first_name} ${localPost.author?.last_name}`,
          text: truncateText(localPost.content, 100),
          url: url,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback para navegadores sem Web Share API
      try {
        await navigator.clipboard.writeText(url);
        success('Link copiado para área de transferência!');
      } catch (err) {
        error('Erro ao copiar link');
      }
    }
  };

  return (
    <article className={`post-card ${compact ? 'post-card-compact' : ''}`}>
      {/* Header do Post */}
      <div className="post-header">
        <Link 
          to={ROUTES.USER_PROFILE.replace(':id', localPost.author_id)}
          className="post-author"
        >
          {localPost.author?.profile_picture ? (
            <img 
              src={localPost.author.profile_picture} 
              alt={localPost.author.first_name}
              className="post-author-avatar"
            />
          ) : (
            <div 
              className="post-author-avatar post-author-avatar-fallback"
              style={{ 
                backgroundColor: generateColorFromString(
                  localPost.author?.username || ''
                ) 
              }}
            >
              {getInitials(
                `${localPost.author?.first_name} ${localPost.author?.last_name}`
              )}
            </div>
          )}
          
          <div className="post-author-info">
            <span className="post-author-name">
              {localPost.author?.first_name} {localPost.author?.last_name}
            </span>
            <span className="post-author-username">
              @{localPost.author?.username}
            </span>
            {localPost.author?.is_verified && (
              <span className="post-author-verified">✓</span>
            )}
          </div>
        </Link>

        <div className="post-meta">
          <span className="post-time">
            {getRelativeTime(localPost.created_at)}
          </span>
          
          {localPost.location && (
            <div className="post-location">
              <FiMapPin />
              <span>{localPost.location}</span>
            </div>
          )}
        </div>

        {/* Menu de opções */}
        <div className="post-menu">
          <button 
            className="post-menu-trigger"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FiMoreHorizontal />
          </button>
          
          {showMenu && (
            <div className="post-menu-dropdown">
              {isOwner ? (
                <>
                  <button className="post-menu-item">
                    <FiEdit3 />
                    Editar
                  </button>
                  <button 
                    className="post-menu-item post-menu-item-danger"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <FiTrash2 />
                    )}
                    Deletar
                  </button>
                </>
              ) : (
                <button className="post-menu-item">
                  <FiFlag />
                  Reportar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo do Post */}
      <div className="post-content">
        <p className="post-text">{localPost.content}</p>
        
        {/* Mídia do post */}
        {localPost.media_urls && localPost.media_urls.length > 0 && (
          <div className={`post-media ${localPost.media_urls.length > 1 ? 'post-media-grid' : ''}`}>
            {localPost.media_urls.map((url, index) => (
              <div key={index} className="post-media-item">
                {localPost.post_type === 'video' ? (
                  <video 
                    src={url} 
                    controls 
                    className="post-media-video"
                    poster={localPost.thumbnail_url}
                  />
                ) : (
                  <img 
                    src={url} 
                    alt={`Imagem ${index + 1} do post`}
                    className="post-media-image"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions do Post */}
      <div className="post-actions">
        <div className="post-actions-main">
          <button 
            className={`post-action ${localPost.is_liked ? 'post-action-liked' : ''}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            {isLiking ? (
              <LoadingSpinner size="sm" />
            ) : (
              <FiHeart className={localPost.is_liked ? 'filled' : ''} />
            )}
            <span>{formatNumber(localPost.likes_count)}</span>
          </button>

          <Link 
            to={ROUTES.POST_DETAIL.replace(':id', localPost.id)}
            className="post-action"
          >
            <FiMessageCircle />
            <span>{formatNumber(localPost.comments_count)}</span>
          </Link>

          <button 
            className="post-action"
            onClick={handleShare}
          >
            <FiShare2 />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>

      {/* Overlay do menu (mobile) */}
      {showMenu && (
        <div 
          className="post-menu-overlay"
          onClick={() => setShowMenu(false)}
        />
      )}
    </article>
  );
};

export default PostCard;