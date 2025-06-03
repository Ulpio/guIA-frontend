import React, { useState, useRef } from 'react';
import { 
  FiX, 
  FiImage, 
  FiMapPin, 
  FiSmile,
  FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { postAPI, mediaAPI } from '../services/api';
import { LoadingSpinner } from './Loading';
import { VALIDATION, FILE_UPLOAD } from '../utils/constants';
import { 
  validateFile, 
  createFilePreviewUrl,
  getInitials,
  generateColorFromString
} from '../utils/helpers';

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar cada arquivo
    const validFiles = [];
    const invalidFiles = [];
    
    files.forEach(file => {
      const validation = validateFile(file, 'image');
      if (validation.isValid) {
        validFiles.push({
          file,
          preview: createFilePreviewUrl(file),
          type: file.type.startsWith('video/') ? 'video' : 'image'
        });
      } else {
        invalidFiles.push({ file, error: validation.error });
      }
    });

    if (invalidFiles.length > 0) {
      error(`Alguns arquivos são inválidos: ${invalidFiles[0].error}`);
    }

    // Limitar total de arquivos
    const totalFiles = selectedFiles.length + validFiles.length;
    if (totalFiles > FILE_UPLOAD.MAX_FILES_MULTIPLE) {
      error(`Máximo de ${FILE_UPLOAD.MAX_FILES_MULTIPLE} arquivos por post`);
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      // Revogar URL do preview para liberar memória
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return [];

    setIsUploadingMedia(true);
    const uploadedUrls = [];

    try {
      for (const fileData of selectedFiles) {
        const response = await mediaAPI.uploadImage(fileData.file);
        uploadedUrls.push(response.data.data.url);
      }
      
      return uploadedUrls;
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      throw new Error('Erro ao fazer upload das mídias');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && selectedFiles.length === 0) {
      error('Digite algo ou adicione uma mídia');
      return;
    }

    if (content.length > VALIDATION.POST_CONTENT.MAX_LENGTH) {
      error(`Conteúdo deve ter no máximo ${VALIDATION.POST_CONTENT.MAX_LENGTH} caracteres`);
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload das mídias primeiro
      const mediaUrls = await uploadFiles();

      // Criar o post
      const postData = {
        content: content.trim(),
        media_urls: mediaUrls,
        location: location.trim() || undefined,
        post_type: mediaUrls.length > 0 ? 'image' : 'text'
      };

      const response = await postAPI.createPost(postData);
      
      success('Post criado com sucesso!');
      onPostCreated(response.data.data);
      onClose();
    } catch (err) {
      console.error('Erro ao criar post:', err);
      error(err.response?.data?.message || 'Erro ao criar post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter para enviar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const remainingChars = VALIDATION.POST_CONTENT.MAX_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content create-post-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="create-post-header">
          <h2>Criar post</h2>
          <button 
            className="create-post-close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="create-post-form">
          {/* User info */}
          <div className="create-post-user">
            {user?.profile_picture ? (
              <img 
                src={user.profile_picture} 
                alt={user.first_name}
                className="create-post-avatar"
              />
            ) : (
              <div 
                className="create-post-avatar create-post-avatar-fallback"
                style={{ 
                  backgroundColor: generateColorFromString(user?.username || '') 
                }}
              >
                {getInitials(`${user?.first_name} ${user?.last_name}`)}
              </div>
            )}
            
            <div className="create-post-user-info">
              <span className="create-post-user-name">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="create-post-user-username">
                @{user?.username}
              </span>
            </div>
          </div>

          {/* Content textarea */}
          <div className="create-post-content">
            <textarea
              placeholder="O que você quer compartilhar?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`create-post-textarea ${isOverLimit ? 'error' : ''}`}
              rows={4}
              disabled={isSubmitting}
            />
            
            {/* Character count */}
            <div className={`create-post-char-count ${isOverLimit ? 'error' : ''}`}>
              {remainingChars}
            </div>
          </div>

          {/* Location input */}
          <div className="create-post-location">
            <div className="create-post-location-input">
              <FiMapPin className="create-post-location-icon" />
              <input
                type="text"
                placeholder="Adicionar localização"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="create-post-location-field"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Media preview */}
          {selectedFiles.length > 0 && (
            <div className="create-post-media">
              <div className="create-post-media-grid">
                {selectedFiles.map((fileData, index) => (
                  <div key={index} className="create-post-media-item">
                    {fileData.type === 'video' ? (
                      <video 
                        src={fileData.preview}
                        className="create-post-media-preview"
                        controls
                      />
                    ) : (
                      <img 
                        src={fileData.preview}
                        alt={`Preview ${index + 1}`}
                        className="create-post-media-preview"
                      />
                    )}
                    
                    <button
                      type="button"
                      className="create-post-media-remove"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isSubmitting}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="create-post-actions">
            <div className="create-post-tools">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
              
              <button
                type="button"
                className="create-post-tool"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting || selectedFiles.length >= FILE_UPLOAD.MAX_FILES_MULTIPLE}
                title="Adicionar fotos ou vídeos"
              >
                <FiImage />
              </button>

              <button
                type="button"
                className="create-post-tool"
                disabled={isSubmitting}
                title="Adicionar emoji (em breve)"
              >
                <FiSmile />
              </button>
            </div>

            <div className="create-post-submit-area">
              {isUploadingMedia && (
                <div className="create-post-uploading">
                  <LoadingSpinner size="sm" />
                  <span>Enviando mídias...</span>
                </div>
              )}
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  isSubmitting || 
                  isUploadingMedia || 
                  (!content.trim() && selectedFiles.length === 0) ||
                  isOverLimit
                }
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    Postando...
                  </>
                ) : (
                  'Postar'
                )}
              </button>
            </div>
          </div>

          {/* Help text */}
          <div className="create-post-help">
            <p>
              Dica: Use <kbd>Ctrl</kbd> + <kbd>Enter</kbd> para postar rapidamente
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;