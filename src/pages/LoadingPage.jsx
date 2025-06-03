import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/Loading';
import { ROUTES, ERROR_MESSAGES } from '../utils/constants';
import { isValidEmail } from '../utils/helpers';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await login({
        login: data.login.trim(),
        password: data.password,
      });

      if (result.success) {
        success('Login realizado com sucesso!');
        navigate(ROUTES.HOME);
      } else {
        error(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      error('Algo deu errado. Tente novamente.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Lado esquerdo - Imagem/Branding */}
        <div className="auth-brand">
          <div className="auth-brand-content">
            <h1 className="auth-brand-title">guIA</h1>
            <p className="auth-brand-subtitle">
              Conecte-se com viajantes do mundo todo
            </p>
            <div className="auth-brand-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">🗺️</span>
                <span>Crie roteiros incríveis</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">📸</span>
                <span>Compartilhe suas experiências</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">🌍</span>
                <span>Descubra novos destinos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            {/* Header */}
            <div className="auth-header">
              <h2 className="auth-title">Entrar</h2>
              <p className="auth-description">
                Bem-vindo de volta! Entre em sua conta para continuar.
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              {/* Email/Username */}
              <div className="form-group">
                <label htmlFor="login" className="form-label">
                  Email ou nome de usuário
                </label>
                <div className="form-input-container">
                  <FiMail className="form-input-icon" />
                  <input
                    id="login"
                    type="text"
                    className={`form-control ${errors.login ? 'error' : ''}`}
                    placeholder="Digite seu email ou @usuario"
                    disabled={isLoading}
                    {...register('login', {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
                      validate: (value) => {
                        const trimmedValue = value.trim();
                        if (!trimmedValue) {
                          return ERROR_MESSAGES.REQUIRED_FIELD;
                        }
                        // Se contém @ deve ser um email válido
                        if (trimmedValue.includes('@')) {
                          return isValidEmail(trimmedValue) || ERROR_MESSAGES.INVALID_EMAIL;
                        }
                        // Se não contém @, deve ser um username válido
                        if (trimmedValue.length < 3) {
                          return 'Nome de usuário deve ter pelo menos 3 caracteres';
                        }
                        return true;
                      },
                    })}
                  />
                </div>
                {errors.login && (
                  <span className="form-error">{errors.login.message}</span>
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
                    placeholder="Digite sua senha"
                    disabled={isLoading}
                    {...register('password', {
                      required: ERROR_MESSAGES.REQUIRED_FIELD,
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

              {/* Esqueci a senha */}
              <div className="auth-forgot">
                <Link to="/forgot-password" className="auth-forgot-link">
                  Esqueceu sua senha?
                </Link>
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
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>

              {/* Divider */}
              <div className="auth-divider">
                <span>ou</span>
              </div>

              {/* Social Login (placeholder para implementação futura) */}
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
                  Entrar com Google
                </button>
              </div>

              {/* Link para registro */}
              <div className="auth-footer">
                <p>
                  Não tem uma conta?{' '}
                  <Link to={ROUTES.REGISTER} className="auth-link">
                    Criar conta
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

export default LoginPage;