import axios from 'axios'

// Vous pourrez remplacer cette URL par votre variable d'environnement (ex: import.meta.env.VITE_API_URL)
const API_BASE_URL = 'http://localhost:3000/api'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour les requêtes (ex: ajouter le token d'authentification)
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour les réponses (ex: gestion globale des erreurs)
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Gestion des erreurs d'authentification par exemple
    // if (error.response?.status === 401) {
    //   // Rediriger vers la page de login ou rafraîchir le token
    // }
    return Promise.reject(error)
  }
)
