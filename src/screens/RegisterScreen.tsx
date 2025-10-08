import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { register } from '../api/authService';
import { RegisterRequest } from '../types/registerRequest.interface';
import { AddressType } from '../types/address.interface';

export default function RegisterScreen({ navigation }: any) {
  // Estados del formulario
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: {
      addressType: AddressType.BOTH,
      firstName: '',
      lastName: '',
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      postalCode: '',
      countryCode: 'MX',
      isBillingDefault: true,
      isShippingDefault: true,
    },
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
  const updateField = (field: string, value: string, isAddress = false) => {
    setFormData(prev => {
      if (isAddress) {
        return {
          ...prev,
          address: {
            ...prev.address,
            [field]: value,
          },
        };
      }
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
    if (!formData.lastName.trim())
      newErrors.lastName = 'El apellido es requerido';
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
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El teléfono es requerido';
    }

    // Validar campos de dirección
    if (!formData.address.firstName.trim())
      newErrors.addressFirstName = 'El nombre de dirección es requerido';
    if (!formData.address.lastName.trim())
      newErrors.addressLastName = 'El apellido de dirección es requerido';
    if (!formData.address.street.trim())
      newErrors.street = 'La calle es requerida';
    if (!formData.address.city.trim())
      newErrors.city = 'La ciudad es requerida';
    if (!formData.address.state.trim())
      newErrors.state = 'El estado es requerido';
    if (!formData.address.postalCode.trim())
      newErrors.postalCode = 'El código postal es requerido';
    if (!formData.address.countryCode.trim())
      newErrors.countryCode = 'El código de país es requerido';

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
            source={require('../assets/images/logoIcon.png')}
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
            <Text style={styles.label}>Nombre *</Text>
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
            <Text style={styles.label}>Apellido *</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              value={formData.lastName}
              onChangeText={value => updateField('lastName', value)}
              placeholder="Ingresa tu apellido"
              autoCapitalize="words"
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
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
            <Text style={styles.label}>Contraseña *</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={[styles.input, errors.phoneNumber && styles.inputError]}
              value={formData.phoneNumber}
              onChangeText={value => updateField('phoneNumber', value)}
              placeholder="1234567890"
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
          </View>

          {/* Información de Dirección */}
          <Text style={styles.sectionTitle}>Dirección de Envío</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre para dirección *</Text>
            <TextInput
              style={[
                styles.input,
                errors.addressFirstName && styles.inputError,
              ]}
              value={formData.address.firstName}
              onChangeText={value => updateField('firstName', value, true)}
              placeholder="Nombre para envío"
              autoCapitalize="words"
            />
            {errors.addressFirstName && (
              <Text style={styles.errorText}>{errors.addressFirstName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Apellido para dirección *</Text>
            <TextInput
              style={[
                styles.input,
                errors.addressLastName && styles.inputError,
              ]}
              value={formData.address.lastName}
              onChangeText={value => updateField('lastName', value, true)}
              placeholder="Apellido para envío"
              autoCapitalize="words"
            />
            {errors.addressLastName && (
              <Text style={styles.errorText}>{errors.addressLastName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Calle y número *</Text>
            <TextInput
              style={[styles.input, errors.street && styles.inputError]}
              value={formData.address.street}
              onChangeText={value => updateField('street', value, true)}
              placeholder="Calle Principal 123"
            />
            {errors.street && (
              <Text style={styles.errorText}>{errors.street}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Colonia (opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.address.neighborhood || ''}
              onChangeText={value => updateField('neighborhood', value, true)}
              placeholder="Colonia"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ciudad *</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              value={formData.address.city}
              onChangeText={value => updateField('city', value, true)}
              placeholder="Ciudad de México"
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estado *</Text>
            <TextInput
              style={[styles.input, errors.state && styles.inputError]}
              value={formData.address.state}
              onChangeText={value => updateField('state', value, true)}
              placeholder="CDMX"
            />
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código Postal *</Text>
            <TextInput
              style={[styles.input, errors.postalCode && styles.inputError]}
              value={formData.address.postalCode}
              onChangeText={value => updateField('postalCode', value, true)}
              placeholder="12345"
              keyboardType="numeric"
            />
            {errors.postalCode && (
              <Text style={styles.errorText}>{errors.postalCode}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>País *</Text>
            <TextInput
              style={[styles.input, errors.countryCode && styles.inputError]}
              value={formData.address.countryCode}
              onChangeText={value => updateField('countryCode', value, true)}
              placeholder="MX"
              autoCapitalize="characters"
              maxLength={2}
            />
            {errors.countryCode && (
              <Text style={styles.errorText}>{errors.countryCode}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
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
    height: 40,
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
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#666',
  },
  loginLinkTextBold: {
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