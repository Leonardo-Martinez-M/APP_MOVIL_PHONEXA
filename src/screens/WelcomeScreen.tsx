import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const BackgroundAbstract = require('../assets/images/bg-image.png');
import { COLORS } from '../constants/colors';

export default function WelcomeScreen({ navigation }: any) {
  const gradientColors = ['#00BF63', '#0A4C40'];

  return (

    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fullScreen}
    >
      <Image
        source={BackgroundAbstract}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      <Text style={styles.welcomeText}>PHONEXA</Text>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require('./../assets/images/avion.png')}
            style={styles.logo}
            resizeMode='contain'
          />
          <View style={styles.header}>
            <Text style={styles.subtitle}>Domina el Alfabeto Aeronáutico en tiempo récord</Text>
          </View>

          <View style={styles.buttonContainer}>
            {/* 1. BOTÓN INICIAR SESIÓN */}
            <TouchableOpacity
              style={styles.secondaryButtonContainer} // Nuevo contenedor con borde/sombra
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient
                // Degradado sutil (diferente al principal)
                colors={[COLORS.darkGreen, '#00BF63']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient} // Relleno interno
              >
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 2. BOTÓN REGISTRARSE */}
            <TouchableOpacity
              style={styles.primaryButtonContainer} // Nuevo contenedor con borde/sombra
              onPress={() => navigation.navigate('Register')}
            >
              <LinearGradient
                // Degradado principal del diseño
                colors={['#00BF63', '#0A4C40']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient} // Relleno interno
              >
                <Text style={styles.buttonText}>Registrarse</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    zIndex: 10,
    marginTop: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  welcomeText: {
    position: 'absolute',
    top: 50,
    right: 20,
    color: 'white',
    fontSize: 28,
    fontFamily: 'MontserratAlternates-Bold',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  container: {
    width: '85%',
    height: '90%',
    padding: 30,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'MontserratAlternates-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '90%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  // Este estilo reemplaza el 'paddingVertical' y 'borderRadius' del estilo 'button' original.
  buttonGradient: {
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  // 2. CONTENEDOR PRIMARIO (REGISTRARME)
  // Se aplica al TouchableOpacity. Define Borde y Sombra.
  primaryButtonContainer: {
    borderRadius: 22, // El mismo radio que tenías
    marginBottom: 25, // El mismo margen que tenías
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5, // Android
    overflow: 'hidden',
    color: 'white'
  },

  secondaryButtonContainer: {
    borderRadius: 22,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
});