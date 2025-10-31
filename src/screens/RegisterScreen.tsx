import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../constants/colors';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ToastAndroid,
  Image,
  StatusBar,
} from 'react-native';
import { register } from '../api/authService';
import { RegisterRequest } from '../types/registerRequest.interface';
import LinearGradient from 'react-native-linear-gradient';

// Importamos la imagen de fondo y el logo
const BackgroundAbstract = require('../assets/images/bg-image.png');

// Colores del degradado principal
const GRADIENT_COLORS = [COLORS.greenBase, '#0A4C40'];

export default function RegisterScreen({ navigation }: any) {
  // Estados del formulario
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    email: '',
    password: '',
    isPremiumUser: 'false',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isMounted = useRef(true);

  // Cleanup cuando el componente se desmonte
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Función para actualizar campos del formulario
  const updateField = (field: keyof RegisterRequest, value: string) => {
    setFormData(prev => {
      return {
        ...prev,
        [field]: value,
      };
    });

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

    // Validar campos personales
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el registro
  const handleRegister = async () => {
    console.log('🔄 Iniciando proceso de registro...');

    if (!validateForm()) {
      console.log('❌ Validación fallida');
      if (isMounted.current) {
        setTimeout(() => {
          if (isMounted.current) {
            Alert.alert('Error', 'Por favor completa todos los campos requeridos');
          }
        }, 100);
      }
      return;
    }

    console.log('✅ Validación exitosa, enviando datos...');
    setLoading(true);
    try {
      await register(formData);
      console.log('✅ Registro exitoso, navegando al login...');

      // Mostrar mensaje de éxito y navegar
      if (Platform.OS === 'android') {
        ToastAndroid.show('Registro exitoso! Ahora puedes iniciar sesión.', ToastAndroid.LONG);
      }

      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Error en registro:', error);

      let errorMessage = 'Error al registrar. Intenta de nuevo.';
      let errorTitle = 'Error';

      // Manejo específico de errores HTTP
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        switch (status) {
          case 400:
            errorTitle = 'Datos inválidos';
            errorMessage =
              'Por favor verifica que todos los campos estén completos y sean correctos.';
            break;
          case 409:
            errorTitle = 'Usuario ya existe';
            errorMessage =
              'Ya existe una cuenta con este email. Intenta iniciar sesión o usa otro email.';
            break;
          case 422:
            errorTitle = 'Datos incompletos';
            errorMessage =
              'Faltan campos requeridos o los datos no son válidos.';
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
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Usar setTimeout para el Alert de error también
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
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.formContainer,
                { transform: [{ translateY: FormAnimate }] },
              ]}
            >
              <Animated.Image
                source={require('../assets/images/avion.png')}
                style={[
                  styles.Image,
                  { opacity: fadeAnim, transform: [{ scale: bounceAnim }] },
                ]}
              />

              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>
                Completa tus datos para registrarte
              </Text>

              {/* Información Personal */}
              <Text style={styles.sectionTitle}>Información Personal</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={formData.name}
                  onChangeText={value => updateField('name', value)}
                  placeholder="Ingresa tu nombre"
                  autoCapitalize="words"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>



              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={value => updateField('email', value)}
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  value={formData.password}
                  onChangeText={value => updateField('password', value)}
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* Botón de registro */}
              <TouchableOpacity
                style={[styles.registerButton, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </Text>
              </TouchableOpacity>

              {/* Link a login */}
              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginLinkText}>
                  ¿Ya tienes cuenta?{' '}
                  <Text style={styles.loginLinkTextBold}>Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

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
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Ajuste para margen superior
    zIndex: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    width: '110%',
    paddingHorizontal: 20,
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
    fontFamily: 'MontserratAlternates-Medium',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'MontserratAlternates-Medium',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'Black',
    backgroundColor: COLORS.greenBase,
    marginTop: 20,
    marginBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  inputContainer: {
    width: '100%',
    height: 40,
    marginBottom: 40,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    marginBottom: 5,
    paddingLeft: 10
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(4, 62, 40, 0.5)',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    shadowColor: '#ffffffff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    textAlign: 'right',
    fontWeight: '500', // Mismo peso que el label (500)
    marginBottom: 5,  // Mismo margen inferior que el label (5)
  },
  registerButton: {
    backgroundColor: '#68D98C',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'white',
  },
  registerButtonText: {
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  loginLinkText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'MontserratAlternates-Medium',

  },
  loginLinkTextBold: {
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