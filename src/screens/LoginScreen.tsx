
import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { login } from '../api/authService';
import { LoginRequest } from '../types/loginRequest.interface';

export default function LoginScreen({ navigation }: any) {
  // Estados del formulario
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const isMounted = useRef(true);

  // Cleanup cuando el componente se desmonte
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Función para actualizar campos del formulario
  const updateField = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Función de validación
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el login
  const handleLogin = async () => {
    if (!validateForm()) {
      if (isMounted.current) {
        setTimeout(() => {
          if (isMounted.current) {
            Alert.alert('Error', 'Por favor completa todos los campos requeridos');
          }
        }, 100);
      }
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      console.log('✅ Login exitoso, navegando a MainTabs...');

      // Mostrar mensaje de éxito y navegar
      if (Platform.OS === 'android') {
        ToastAndroid.show('¡Bienvenido de nuevo!', ToastAndroid.SHORT);
      }
      
      navigation.replace('MainTabs');
    } catch (error: any) {
      console.error('Error en login:', error);

      let errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
      let errorTitle = 'Error';

      // Manejo específico de errores HTTP
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        switch (status) {
          case 401:
            errorTitle = 'Credenciales incorrectas';
            errorMessage =
              'El email o la contraseña son incorrectos. Verifica tus datos e intenta de nuevo.';
            break;
          case 400:
            errorTitle = 'Datos inválidos';
            errorMessage =
              'Por favor verifica que el email y contraseña sean correctos.';
            break;
          case 404:
            errorTitle = 'Usuario no encontrado';
            errorMessage = 'No existe una cuenta con este email.';
            break;
          case 500:
            errorTitle = 'Error del servidor';
            errorMessage =
              'Error interno del servidor. Intenta de nuevo más tarde.';
            break;
          default:
            // Usar mensaje del servidor si está disponible
            if (responseData?.message) {
              const message = responseData.message;
              errorMessage = Array.isArray(message)
                ? message.join(', ')
                : String(message);
            }
        }
      } else if (
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('Network Error')
      ) {
        errorTitle = 'Error de conexión';
        errorMessage =
          'No se pudo conectar al servidor. Verifica tu conexión a internet e intenta de nuevo.';
      } else if (
        error.message?.includes('No se pudo guardar la sesión de forma segura')
      ) {
        errorTitle = 'Error de seguridad';
        errorMessage =
          'No se pudo guardar tu sesión de forma segura. Esto puede deberse a un problema con la configuración del dispositivo. Intenta de nuevo o contacta soporte.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (isMounted.current) {
        setTimeout(() => {
          if (isMounted.current) {
            Alert.alert(errorTitle, errorMessage);
          }
        }, 100);
      }
    } finally {
      setLoading(false);
    }
  };

  // Animaciones de inicio de sesion
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const FormAnimate = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(FormAnimate, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View
        style={[
          styles.formContainer,
          { transform: [{ translateY: FormAnimate }] },
        ]}
      >
        <Animated.Image
          source={require('../assets/images/logoIcon.png')}
          style={[
            styles.Image,
            { opacity: fadeAnim, transform: [{ scale: bounceAnim }] },
          ]}
        />
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>
          Ingresa tus credenciales para continuar
        </Text>

        {/* Campo Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={value => updateField('email', value)}
            placeholder="Ejemplo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Campo Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View
            style={[
              styles.passwordContainer,
              errors.password && styles.passwordContainerError,
            ]}
          >
            <TextInput
              style={[
                styles.passwordInput,
                errors.password && styles.inputError,
              ]}
              value={formData.password}
              onChangeText={value => updateField('password', value)}
              placeholder="Ingresa tu contraseña"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Botón de login */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>

        {/* Link a registro */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerLinkText}>
            ¿No tienes cuenta?{' '}
            <Text style={styles.registerLinkTextBold}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    width: '100%',
    maxWidth: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 40,
    borderColor: 'white',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'black',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    shadowColor: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',
    height: 50,
    borderColor: 'black',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    shadowColor: '#000',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderWidth: 0, // Sin borde porque el contenedor ya lo tiene
  },
  eyeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  passwordContainerError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    padding: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  registerLink: {
    alignItems: 'center',
  },
  registerLinkText: {
    padding: 20,
    fontSize: 16,
    color: '#666',
  },
  registerLinkTextBold: {
    color: '#007AFF',
    fontWeight: '600',
  },
  Image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});
