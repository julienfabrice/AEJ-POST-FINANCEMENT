import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

// URL de base de l'API (à définir dans le fichier .env)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Intercepteur pour injecter le token d'authentification
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs globales (ex: 401 Non Autorisé)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Le token est expiré ou invalide : on déconnecte l'utilisateur
      useAuthStore.getState().clearSession()
      
      // Optionnel: rediriger vers la page de login, mais le store déclenchera
      // probablement déjà une redirection via la logique des routes.
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
