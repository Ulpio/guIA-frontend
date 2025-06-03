import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  FiEye, 
  FiEyeOff, 
  FiMail, 
  FiLock, 
  FiUser 
} from 'react-icons/fi';

import { 
  FaUsers, 
  FaBuilding 
} from 'react-icons/fa';

import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/Loading';
import { ROUTES, ERROR_MESSAGES, USER_TYPES } from '../utils/constants';
import { isValidEmail, isValidUsername, isValidPassword } from '../utils/helpers';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState(USER_TYPES.NORMAL);
  const { register: registerUser, isLoading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const result = await registerUser({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        user_type: userType,
        ...(userType === USER_TYPES.COMPANY && data.companyName ? {
          company_name: data.companyName.trim()
        } : {})
      });

      if (result.success) {
        success('Conta criada com sucesso! Bem-vindo ao guIA!');
        navigate(ROUTES.HOME);
      } else {
        error(result.error || 'Erro ao criar conta');
      }
    } catch (err) {
      console.error('Erro no registro:', err);
      error('Algo deu errado. Tente novamente.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Lado esquerdo - Branding */}
        <div className="auth-brand">
          <div className="auth-brand-content">
            <h1 className="auth-brand-title">guIA</h1>
            <p className="auth-brand-subtitle">
              Junte-se à maior comunidade de viajantes
            </p>
            <div className="auth-brand-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">✈️</span>
                <span>Planeje suas viagens</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">👥</span>
                <span>Conecte-se com viajantes</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">🎯</span>
                <span>Descubra experiências únicas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            {/* Header */}
            <div className="auth-header">
              <h2 className="auth-title">Criar conta</h2>
              <p className="auth-description">
                Preencha os dados abaixo para começar sua jornada.
              </p>
            </div>

            {/* Seleção de tipo de usuário */}
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-option ${userType === USER_TYPES.NORMAL ? 'active' : ''}`}
                onClick={() => setUserType(USER_TYPES.NORMAL)}
              >
                <FiUser className="user-type-icon" />
                <div className="user-type-content">
                  <span className="user-type-title">Pessoal</span>
                  <span className="user-type-desc">Para viajantes individuais</span>
                </div>
              </button>
              
              <button
                type="button"
                className={`user-type-option ${userType === USER_TYPES.COMPANY ? 'active' : ''}`}
                onClick={() => setUserType(USER_TYPES.COMPANY)}
              >
                <FaBuilding className="user-type-icon" />
                <div className="user-type-content">
                  <span className="user-type-title">Empresa</span>
                  <span className="user-type-desc">Para agências e negócios</span>
                </div>
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              {/* Nome e Sobrenome */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    Nome
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`form-control ${errors.firstName ? 'error' : ''}`}
                    placeholder="Seu nome"
                    disabled={isLoading}
                    {...register('firstName', {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      minLength: {
                        value: 2,
                        message: 'Nome deve ter pelo menos 2 caracteres'
                      },
                      maxLength: {
                        value: 50,
                        message: 'Nome deve ter no máximo 50 caracteres'
                      }
                    })}
                  />
                  {errors.firstName && (
                    <span className="form-error">{errors.firstName.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Sobrenome
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`form-control ${errors.lastName ? 'error' : ''}`}
                    placeholder="Seu sobrenome"
                    disabled={isLoading}
                    {...register('lastName', {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      minLength: {
                        value: 2,
                        message: 'Sobrenome deve ter pelo menos 2 caracteres'
                      },
                      maxLength: {
                        value: 50,
                        message: 'Sobrenome deve ter no máximo 50 caracteres'
                      }
                    })}
                  />
                  {errors.lastName && (
                    <span className="form-error">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              {/* Nome da empresa (se for empresa) */}
              {userType === USER_TYPES.COMPANY && (
                <div className="form-group">
                  <label htmlFor="companyName" className="form-label">
                    Nome da empresa
                  </label>
                  <div className="form-input-container">
                    <FaBuilding className="form-input-icon" />
                    <input
                      id="companyName"
                      type="text"
                      className={`form-control ${errors.companyName ? 'error' : ''}`}
                      placeholder="Nome da sua empresa"
                      disabled={isLoading}
                      {...register('companyName', {
                        required: userType === USER_TYPES.COMPANY ? ERROR_MESSAGES.REQUIRED_FIELD : false,
                        minLength: {
                          value: 2,
                          message: 'Nome da empresa deve ter pelo menos 2 caracteres'
                        },
                        maxLength: {
                          value: 100,
                          message: 'Nome da empresa deve ter no máximo 100 caracteres'
                        }
                      })}
                    />
                  </div>
                  {errors.companyName && (
                    <span className="form-error">{errors.companyName.message}</span>
                  )}
                </div>
              )}

              {/* Username */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Nome de usuário
                </label>
                <div className="form-input-container">
                  <span className="form-input-prefix">@</span>
                  <input
                    id="username"
                    type="text"
                    className={`form-control ${errors.username ? 'error' : ''}`}
                    placeholder="seuusuario"
                    disabled={isLoading}
                    {...register('username', {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      validate: (value) => {
                        return isValidUsername(value) || ERROR_MESSAGES.USERNAME_INVALID;
                      }
                    })}
                  />
                </div>
                {errors.username && (
                  <span className="form-error">{errors.username.message}</span>
                )}
                <span className="form-help">
                  Apenas letras, números e underscore. Mínimo 3 caracteres.
                </span>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="form-input-container">
                  <FiMail className="form-input-icon" />
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    placeholder="seu@email.com"
                    disabled={isLoading}
                    {...register('email', {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      validate: (value) => {
                        return isValidEmail(value) || ERROR_MESSAGES.INVALID_EMAIL;
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <span className="form-error">{errors.email.message}</span>
                )}
              </div>

              {/* Senha */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <div className="form-input-container">
                  <FiLock className="form-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'error' : ''}`}
                    placeholder="Crie uma senha segura"
                    disabled={isLoading}
                    {...register('password', {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      validate: (value) => {
                        return isValidPassword(value) || ERROR_MESSAGES.PASSWORD_TOO_SHORT;
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="form-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="form-error">{errors.password.message}</span>
                )}
              </div>

              {/* Confirmar senha */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar senha
                </label>
                <div className="form-input-container">
                  <FiLock className="form-input-icon" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirme sua senha"
                    disabled={isLoading}
                    {...register('confirmPassword', {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      validate: (value) => {
                        return value === password || ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="form-input-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword.message}</span>
                )}
              </div>

              {/* Termos de uso */}
              <div className="form-group">
                <div className="form-check">
                  <input
                    id="terms"
                    type="checkbox"
                    className="form-check-input"
                    disabled={isLoading}
                    {...register('terms', {
                      required: 'Você deve aceitar os termos de uso'
                    })}
                  />
                  <label htmlFor="terms" className="form-check-label">
                    Aceito os{' '}
                    <Link to="/terms" className="auth-link" target="_blank">
                      Termos de Uso
                    </Link>
                    {' '}e a{' '}
                    <Link to="/privacy" className="auth-link" target="_blank">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <span className="form-error">{errors.terms.message}</span>
                )}
              </div>

              {/* Botão de submit */}
              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>

              {/* Divider */}
              <div className="auth-divider">
                <span>ou</span>
              </div>

              {/* Social Login (placeholder) */}
              <div className="auth-social">
                <button 
                  type="button" 
                  className="btn btn-outline auth-social-btn"
                  disabled={true}
                >
                  <img 
                    src="/assets/google-icon.svg" 
                    alt="Google" 
                    className="auth-social-icon"
                  />
                  Registrar com Google
                </button>
              </div>

              {/* Link para login */}
              <div className="auth-footer">
                <p>
                  Já tem uma conta?{' '}
                  <Link to={ROUTES.LOGIN} className="auth-link">
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;