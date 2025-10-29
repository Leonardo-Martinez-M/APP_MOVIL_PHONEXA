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
import { useAuth } from '../navigation/AppNavigator';
import { LoginRequest } from '../types/loginRequest.interface';
import LinearGradient from 'react-native-linear-gradient';

// Importamos la imagen de fondo y el logo (Asegúrate de que estas rutas sean correctas)
const BackgroundAbstract = require('../assets/images/bg-image.png');
const LogoImage = require('../assets/images/avion.png'); // Usaré 'avion.png' como en el registro, asumiendo que es tu logo principal.

// Colores del degradado principal (copiados del RegisterScreen)
const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();
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
      await signIn(formData);
      console.log('✅ Login exitoso, navegando a MainTabs...');

      // Mostrar mensaje de éxito y navegar
      if (Platform.OS === 'android') {
        ToastAndroid.show('¡Bienvenido de nuevo!', ToastAndroid.SHORT);
      }

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
  }, [fadeAnim, bounceAnim]);

  const FormAnimate = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(FormAnimate, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [FormAnimate]);

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fullScreen}
    >
      <Image
        source={BackgroundAbstract}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View
          style={[
            styles.formContainer,
            { transform: [{ translateY: FormAnimate }] },
          ]}
        >
          <Animated.Image
            source={LogoImage} // Usando el logo principal (avion.png)
            style={[
              styles.Image,
              { opacity: fadeAnim, transform: [{ scale: bounceAnim }] },
            ]}
          />
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>
            Ingresa tus credenciales para continuar
          </Text>

          {/* Campo Email - Estructura Modificada */}
          <View style={styles.inputContainer}>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : (
              <Text style={styles.label}>Email</Text>
            )}
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={value => updateField('email', value)}
              placeholder="Ejemplo@email.com"
              placeholderTextColor="rgba(255, 255, 255, 0.5)" // Para que se vea en el fondo oscuro
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Campo Password - Estructura Modificada */}
          <View style={styles.inputContainer}>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : (
              <Text style={styles.label}>Contraseña</Text>
            )}
            <View
              style={[
                styles.passwordContainer,
                errors.password && styles.passwordContainerError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                value={formData.password}
                onChangeText={value => updateField('password', value)}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="rgba(255, 255, 255, 0.5)" // Para que se vea en el fondo oscuro
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color="rgba(255, 255, 255, 0.8)" // Color de icono blanco semi-transparente
                />
              </TouchableOpacity>
            </View>
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
              ¿Aún no tienes cuenta?{' '}
              <Text style={styles.registerLinkTextBold}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// ----------------------------------------------------
// ESTILOS UNIFICADOS Y MODIFICADOS
// ----------------------------------------------------

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    zIndex: 10,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'MontserratAlternates-Medium', // Usando la fuente de RegisterScreen
    color: 'white', // Color blanco
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14, // Tamaño de fuente de RegisterScreen
    color: 'white',
    textAlign: 'center',
    fontFamily: 'MontserratAlternates-Medium',
    marginBottom: 40, // Aumentado ligeramente para más espacio
  },
  inputContainer: {
    width: '100%',
    marginBottom: 40, // Espaciado entre campos
    alignContent: 'center',
    justifyContent: 'space-between',
    // Quitamos la propiedad 'height: 40' para que el contenido se ajuste dinámicamente
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    marginBottom: 5,
    paddingLeft: 10,
    fontFamily: 'MontserratAlternates-Medium', // Añadir la fuente si aplica
  },
  // Estilo para el campo de texto (TextInput)
  input: {
    width: '100%',
    height: 45, // Altura de RegisterScreen
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(4, 62, 40, 0.5)', // Fondo semitransparente oscuro
    borderWidth: 1, // Borde más delgado
    borderRadius: 15, // Borde redondeado de RegisterScreen
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  // Estilo para el Contenedor de Contraseña (Contenedor del TextInput + Icono)
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 45, // Altura unificada
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(4, 62, 40, 0.5)',
    borderWidth: 1,
    borderRadius: 15,
    paddingRight: 10,
  },
  // Estilo del TextInput DENTRO del Contenedor de Contraseña
  passwordInput: {
    flex: 1,
    paddingVertical: 0, // Ajustar padding vertical
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },
  eyeButton: {
    padding: 5, // Padding más pequeño
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: '#ff4444', // Color de error
  },
  passwordContainerError: {
    borderColor: '#ff4444',
  },
  // Estilo para el Mensaje de Error (ahora ubicado como Label)
  errorText: {
    color: '#ff4444',
    fontSize: 14, // Mismo tamaño que el label
    fontWeight: '500', // Mismo peso que el label
    marginBottom: 5,
    paddingLeft: 10,
    fontFamily: 'MontserratAlternates-Medium',
  },
  // Botón y Links
  loginButton: {
    backgroundColor: '#68D98C', // Color de botón de RegisterScreen
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  registerLinkText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'MontserratAlternates-Medium',
  },
  registerLinkTextBold: {
    color: '#68D98C',
    fontWeight: '600',
  },
  Image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});