import httpClient from './http';
import * as Keychain from 'react-native-keychain';

// Interfaces
import { RegisterRequest } from '../types/registerRequest.interface';
import { LoginRequest } from '../types/loginRequest.interface';
import { RegisterResponse } from '../types/registerResponse.interface';
import { LoginResponse } from '../types/loginResponse.interface';

/**
 * Función para registrar un nuevo usuario
 * @param data - Datos del usuario para registro
 * @returns Promise<RegisterResponse> - Respuesta del servidor con datos del registro
 */
const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    console.log('Iniciando registro...');
    console.log('Datos:', JSON.stringify(data, null, 2));

    const response = await httpClient.post<RegisterResponse>('/users', data);

    console.log('Registro exitoso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error en el servicio de registro:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    throw error;
  }
};

/**
 * Función para iniciar sesión
 * @param data - Credenciales de login (email y password)
 * @returns Promise<LoginResponse> - Respuesta del servidor con token de acceso
 */
const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await httpClient.post<LoginResponse>('/auth/login', data);
    // Si el login es exitoso y recibimos un token...
    if (response.data?.access_token) {
      try {
        // Guardamos el token en el Keychain de forma segura
        await Keychain.setGenericPassword(
          'userToken',
          response.data.access_token,
        );
        console.log('✅ Token guardado en Keychain exitosamente');
      } catch (keychainError) {
        console.error('❌ Error al guardar token en Keychain:', keychainError);
        // Si Keychain falla, el login también debe fallar
        throw new Error(
          'No se pudo guardar la sesión de forma segura. Intenta de nuevo.',
        );
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error en el servicio de login:', error);
    throw error;
  }
};

/**
 * Función para cerrar sesión
 * Elimina el token del Keychain
 */
const logout = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword();
    console.log('✅ Token eliminado del Keychain exitosamente');
  } catch (error) {
    console.error('❌ Error al cerrar sesión (Keychain):', error);
    // Si Keychain falla, el logout también debe fallar
    throw new Error(
      'No se pudo cerrar la sesión de forma segura. Intenta de nuevo.',
    );
  }
};

/**
 * Función para verificar si hay una sesión activa
 * @returns Promise<boolean> - true si hay token guardado
 */
const isLoggedIn = async (): Promise<boolean> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return !!credentials;
  } catch (error) {
    console.error('❌ Error al verificar sesión (Keychain):', error);
    // Si hay problemas con Keychain, asumir que no está logueado
    return false;
  }
};

// Exportamos las funciones
export { register, login, logout, isLoggedIn };
