import axios from 'axios';
import * as Keychain from 'react-native-keychain';

// Instancia de Axios con la URL base jeje
const httpClient = axios.create({
    baseURL: 'http://10.0.2.2:3000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
      },
  });

  // --- Middleware (pa cada petición) ---

  httpClient.interceptors.request.use(
    async (config) => {
      try {
        // Leemos el token que guardamos en el login
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          // Si hay un token, lo añadimos al objeto de configuración de la petición
          config.headers.Authorization = `Bearer ${credentials.password}`;
        }
      } catch (error) {
        console.error("❌ Error al obtener el token del Keychain:", error);
        // No fallar la petición por problemas del Keychain
        console.warn("⚠️ Continuando sin token de autenticación");
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de respuesta para debugging
  httpClient.interceptors.response.use(
    (response) => {
      console.log("✅ Respuesta recibida:", response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error("Error en petición:", error.message);
      console.error("URL:", error.config?.url);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      return Promise.reject(error);
    }
  );

export default httpClient;