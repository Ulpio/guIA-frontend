import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUser, 
  FiSettings, 
  FiUsers, 
  FiMap, 
  FiSearch,
  FiMessageCircle,
  FiHome,
  FiAlertCircle
} from 'react-icons/fi';
import { ROUTES } from '../utils/constants';

// Componente genérico para páginas em construção
const ComingSoonPage = ({ 
  title, 
  description, 
  icon: Icon = FiAlertCircle,
  suggestedActions = []
}) => (
  <div className="coming-soon-page">
    <div className="coming-soon-content">
      <Icon className="coming-soon-icon" />
      <h1 className="coming-soon-title">{title}</h1>
      <p className="coming-soon-description">{description}</p>
      
      {suggestedActions.length > 0 && (
        <div className="coming-soon-actions">
          {suggestedActions.map((action, index) => (
            <Link 
              key={index}
              to={action.to} 
              className="btn btn-outline"
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
);

// Página de perfil
export const ProfilePage = () => (
  <ComingSoonPage
    title="Meu Perfil"
    description="Em breve você poderá visualizar e editar seu perfil completo, ver seus posts, roteiros e estatísticas."
    icon={FiUser}
    suggestedActions={[
      {
        to: ROUTES.HOME,
        icon: <FiHome />,
        label: 'Voltar ao Feed'
      },
      {
        to: ROUTES.SETTINGS,
        icon: <FiSettings />,
        label: 'Configurações'
      }
    ]}
  />
);

// Página de perfil de usuário
export const UserProfilePage = () => (
  <ComingSoonPage
    title="Perfil do Usuário"
    description="Em breve você poderá visualizar perfis de outros usuários, seus posts e roteiros."
    icon={FiUsers}
    suggestedActions={[
      {
        to: ROUTES.HOME,
        icon: <FiHome />,
        label: 'Voltar ao Feed'
      },
      {
        to: ROUTES.SEARCH,
        icon: <FiSearch />,
        label: 'Buscar Usuários'
      }
    ]}
  />
);

// Página de detalhes do post
export const PostDetailPage = () => (
  <ComingSoonPage
    title="Detalhes do Post"
    description="Em breve você poderá ver posts em detalhes, comentários e interagir completamente."
    icon={FiMessageCircle}
    suggestedActions={[
      {
        to: ROUTES.HOME,
        icon: <FiHome />,
        label: 'Voltar ao Feed'
      }
    ]}
  />
);

// Página de roteiros
export const ItinerariesPage = () => (
  <ComingSoonPage
    title="Roteiros"
    description="Explore roteiros incríveis criados pela comunidade guIA. Encontre inspiração para sua próxima viagem!"
    icon={FiMap}
    suggestedActions={[
      {
        to: ROUTES.CREATE_ITINERARY,
        icon: <FiMap />,
        label: 'Criar Roteiro'
      },
      {
        to: ROUTES.HOME,
        icon: <FiHome />,
        label: 'Voltar ao Feed'
      }
    ]}
  />
);

// Página de detalhes do roteiro
export const ItineraryDetailPage = () => (
  <ComingSoonPage
    title="Detalhes do Roteiro"
    description="Em breve você poderá ver roteiros completos com todos os dias, locais e informações detalhadas."
    icon={FiMap}
    suggestedActions={[
      {
        to: ROUTES.ITINERARIES,
        icon: <FiMap />,
        label: 'Ver Roteiros'
      },
      {
        to: ROUTES.CREATE_ITINERARY,
        icon: <FiMap />,
        label: 'Criar Roteiro'
      }
    ]}
  />
);

// Página de criar roteiro
export const CreateItineraryPage = () => (
  <ComingSoonPage
    title="Criar Roteiro"
    description="Em breve você poderá criar roteiros detalhados com dias, locais, custos e todas as informações necessárias para uma viagem perfeita."
    icon={FiMap}
    suggestedActions={[
      {
        to: ROUTES.ITINERARIES,
        icon: <FiMap />,
        label: 'Ver Roteiros'
      },
      {
        to: ROUTES.HOME,
        icon: <FiHome />,
        label: 'Voltar ao Feed'
      }
    ]}
  />
);

// Página de busca
export const SearchPage = () => (
  <ComingSoonPage
    title="Buscar"
    description="Em breve você poderá buscar por usuários, posts, roteiros e descobrir conteúdo incrível na comunidade."
    icon={FiSearch}
    suggestedActions={[
      {
        to: ROUTES.HOME,
        icon: <FiHome />,
        label: 'Voltar ao Feed'
      },
      {
        to: ROUTES.ITINERARIES,
        icon: <FiMap />,
        label: 'Ver Roteiros'
      }
    ]}
  />
);

// Página de configurações
export const SettingsPage = () => (
  <ComingSoonPage
    title="Configurações"
    description="Em breve você poderá personalizar sua conta, privacidade, notificações e preferências."
    icon={FiSettings}
    suggestedActions={[
      {
        to: ROUTES.PROFILE,
        icon: <FiUser />,
        label: 'Meu Perfil'
      },
      {
        to: ROUTES.HOME,
        icon: <FiHome />,
        label: 'Voltar ao Feed'
      }
    ]}
  />
);

// Página de seguidores
export const FollowersPage = () => (
  <ComingSoonPage
    title="Seguidores"
    description="Em breve você poderá ver todos os seus seguidores e gerenciar suas conexões."
    icon={FiUsers}
    suggestedActions={[
      {
        to: ROUTES.PROFILE,
        icon: <FiUser />,
        label: 'Meu Perfil'
      },
      {
        to: ROUTES.SEARCH,
        icon: <FiSearch />,
        label: 'Buscar Usuários'
      }
    ]}
  />
);

// Página de seguindo
export const FollowingPage = () => (
  <ComingSoonPage
    title="Seguindo"
    description="Em breve você poderá ver todos os usuários que você segue e gerenciar suas conexões."
    icon={FiUsers}
    suggestedActions={[
      {
        to: ROUTES.PROFILE,
        icon: <FiUser />,
        label: 'Meu Perfil'
      },
      {
        to: ROUTES.SEARCH,
        icon: <FiSearch />,
        label: 'Buscar Usuários'
      }
    ]}
  />
);

// Página 404
export const NotFoundPage = () => (
  <div className="not-found-page">
    <div className="not-found-content">
      <div className="not-found-icon">404</div>
      <h1 className="not-found-title">Página não encontrada</h1>
      <p className="not-found-description">
        A página que você está procurando não existe ou foi movida.
      </p>
      
      <div className="not-found-actions">
        <Link to={ROUTES.HOME} className="btn btn-primary">
          <FiHome />
          Voltar ao início
        </Link>
        <Link to={ROUTES.SEARCH} className="btn btn-outline">
          <FiSearch />
          Buscar conteúdo
        </Link>
      </div>
    </div>
  </div>
);