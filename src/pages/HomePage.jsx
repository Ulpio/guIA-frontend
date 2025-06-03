import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiMapPin, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { postAPI, itineraryAPI } from '../services/api';
import { LoadingSpinner, GridLoading, ContentLoading } from '../components/Loading';
import PostCard from '../components/PostCard';
import ItineraryCard from '../components/ItineraryCard';
import CreatePostModal from '../components/CreatePostModal';
import { ROUTES } from '../utils/constants';
import { formatNumber } from '../utils/helpers';

const HomePage = () => {
  const { user } = useAuth();
  const { error } = useToast();
  
  // Estados
  const [posts, setPosts] = useState([]);
  const [trendingItineraries, setTrendingItineraries] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingItineraries, setIsLoadingItineraries] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [feedTab, setFeedTab] = useState('feed'); // 'feed' ou 'trending'

  // Carregar feed
  useEffect(() => {
    loadFeed();
    loadTrendingItineraries();
  }, []);

  const loadFeed = async () => {
    try {
      setIsLoadingPosts(true);
      const response = await postAPI.getFeed(20, 0);
      setPosts(response.data.data || []);
    } catch (err) {
      console.error('Erro ao carregar feed:', err);
      error('Erro ao carregar feed');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadTrendingItineraries = async () => {
    try {
      setIsLoadingItineraries(true);
      const response = await itineraryAPI.getItineraries({
        order_by: 'popular',
        limit: 6
      });
      setTrendingItineraries(response.data.data || []);
    } catch (err) {
      console.error('Erro ao carregar roteiros em alta:', err);
      error('Erro ao carregar roteiros em alta');
    } finally {
      setIsLoadingItineraries(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Olá, {user?.first_name}! 👋
          </h1>
          <p className="home-hero-subtitle">
            Pronto para sua próxima aventura? Veja o que está acontecendo na comunidade.
          </p>
          
          <div className="home-hero-stats">
            <div className="home-stat">
              <FiMapPin className="home-stat-icon" />
              <div className="home-stat-content">
                <span className="home-stat-number">
                  {formatNumber(user?.itineraries_count || 0)}
                </span>
                <span className="home-stat-label">Seus roteiros</span>
              </div>
            </div>
            
            <div className="home-stat">
              <FiUsers className="home-stat-icon" />
              <div className="home-stat-content">
                <span className="home-stat-number">
                  {formatNumber(user?.followers_count || 0)}
                </span>
                <span className="home-stat-label">Seguidores</span>
              </div>
            </div>
            
            <div className="home-stat">
              <FiTrendingUp className="home-stat-icon" />
              <div className="home-stat-content">
                <span className="home-stat-number">
                  {formatNumber(user?.following_count || 0)}
                </span>
                <span className="home-stat-label">Seguindo</span>
              </div>
            </div>
          </div>
          
          <div className="home-hero-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreatePost(true)}
            >
              <FiPlus />
              Compartilhar
            </button>
            
            <Link 
              to={ROUTES.CREATE_ITINERARY}
              className="btn btn-outline"
            >
              <FiMapPin />
              Criar Roteiro
            </Link>
          </div>
        </div>
      </div>

      <div className="home-content">
        {/* Main Feed */}
        <div className="home-main">
          {/* Feed Header */}
          <div className="feed-header">
            <div className="feed-tabs">
              <button 
                className={`feed-tab ${feedTab === 'feed' ? 'active' : ''}`}
                onClick={() => setFeedTab('feed')}
              >
                Seu Feed
              </button>
              <button 
                className={`feed-tab ${feedTab === 'trending' ? 'active' : ''}`}
                onClick={() => setFeedTab('trending')}
              >
                <FiTrendingUp />
                Em Alta
              </button>
            </div>
          </div>

          {/* Feed Content */}
          <div className="feed-content">
            {feedTab === 'feed' && (
              <>
                {isLoadingPosts ? (
                  <GridLoading count={3} cardType="post" />
                ) : posts.length > 0 ? (
                  <div className="posts-grid">
                    {posts.map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onUpdate={handlePostUpdated}
                        onDelete={handlePostDeleted}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-content">
                      <FiMapPin className="empty-state-icon" />
                      <h3>Seu feed está vazio</h3>
                      <p>
                        Comece seguindo outros viajantes ou compartilhe sua primeira experiência!
                      </p>
                      <div className="empty-state-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={() => setShowCreatePost(true)}
                        >
                          <FiPlus />
                          Fazer primeiro post
                        </button>
                        <Link to={ROUTES.SEARCH} className="btn btn-outline">
                          Explorar usuários
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {feedTab === 'trending' && (
              <div className="trending-content">
                <p className="trending-description">
                  Descubra o que está sendo mais compartilhado pela comunidade
                </p>
                {/* Implementar posts trending aqui */}
                <div className="coming-soon">
                  <p>Em breve: Posts em alta da comunidade</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="home-sidebar">
          {/* Roteiros em Alta */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3>
                <FiTrendingUp />
                Roteiros em Alta
              </h3>
              <Link to={ROUTES.ITINERARIES} className="sidebar-section-link">
                Ver todos
              </Link>
            </div>
            
            <div className="sidebar-section-content">
              {isLoadingItineraries ? (
                <ContentLoading lines={3} />
              ) : trendingItineraries.length > 0 ? (
                <div className="trending-itineraries">
                  {trendingItineraries.map(itinerary => (
                    <ItineraryCard
                      key={itinerary.id}
                      itinerary={itinerary}
                      compact
                    />
                  ))}
                </div>
              ) : (
                <p className="sidebar-empty">
                  Nenhum roteiro em alta no momento.
                </p>
              )}
            </div>
          </div>

          {/* Sugestões de Conexão */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <h3>
                <FiUsers />
                Conectar-se
              </h3>
              <Link to={ROUTES.SEARCH} className="sidebar-section-link">
                Ver mais
              </Link>
            </div>
            
            <div className="sidebar-section-content">
              <div className="coming-soon">
                <p>Em breve: Sugestões de usuários para seguir</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="sidebar-section">
            <div className="cta-card">
              <h4>Crie seu primeiro roteiro</h4>
              <p>
                Compartilhe suas experiências de viagem e ajude outros viajantes a descobrirem novos destinos.
              </p>
              <Link to={ROUTES.CREATE_ITINERARY} className="btn btn-primary btn-sm">
                <FiPlus />
                Criar roteiro
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de criar post */}
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default HomePage;