import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const BackgroundAbstract = require('../assets/images/bg-image.png');
import { COLORS } from '../constants/colors';

export default function WelcomeScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const gradientColors = ['#00BF63', '#0A4C40'];

  // Escalado basado en el ancho del dispositivo
  const scale = (size: number) => {
    const baseWidth = 375; // iPhone 8
    return (width / baseWidth) * size;
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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

        {/* Título PHONEXA */}
        <Text style={[
          styles.welcomeText,
          {
            top: scale(50),
            right: scale(20),
            fontSize: scale(28)
          }
        ]}>
          PHONEXA
        </Text>

        {/* Contenido principal */}
        <View style={styles.overlay}>
          <View style={[
            styles.container,
            {
              width: width * 0.85,
              padding: scale(30),
              marginTop: height * 0.1 // Ajusta esta posición según necesites
            }
          ]}>
            <Image
              source={require('./../assets/images/avion.png')}
              style={[
                styles.logo,
                {
                  width: scale(200),
                  height: scale(200)
                }
              ]}
              resizeMode='contain'
            />

            <View style={[styles.header, { marginBottom: scale(50) }]}>
              <Text style={[
                styles.subtitle,
                { fontSize: scale(16) }
              ]}>
                Domina el Alfabeto Aeronáutico en tiempo récord
              </Text>
            </View>

            <View style={[
              styles.buttonContainer,
              { width: '100%' }
            ]}>
              {/* BOTÓN INICIAR SESIÓN */}
              <TouchableOpacity
                style={[
                  styles.secondaryButtonContainer,
                  {
                    marginBottom: scale(25),
                    borderRadius: scale(22)
                  }
                ]}
                onPress={() => navigation.navigate('Login')}
              >
                <LinearGradient
                  colors={[COLORS.darkGreen, '#00BF63']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.buttonGradient,
                    {
                      paddingVertical: scale(15),
                      borderRadius: scale(20)
                    }
                  ]}
                >
                  <Text style={[
                    styles.buttonText,
                    { fontSize: scale(16) }
                  ]}>
                    Iniciar Sesión
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* BOTÓN REGISTRARSE */}
              <TouchableOpacity
                style={[
                  styles.primaryButtonContainer,
                  {
                    marginBottom: scale(25),
                    borderRadius: scale(22)
                  }
                ]}
                onPress={() => navigation.navigate('Register')}
              >
                <LinearGradient
                  colors={['#00BF63', '#0A4C40']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.buttonGradient,
                    {
                      paddingVertical: scale(15),
                      borderRadius: scale(20)
                    }
                  ]}
                >
                  <Text style={[
                    styles.buttonText,
                    { fontSize: scale(16) }
                  ]}>
                    Registrarse
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Dimensiones definidas dinámicamente
  },
  welcomeText: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'MontserratAlternates-Bold',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    zIndex: 20,
  },
  header: {
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: 'MontserratAlternates-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22, // Mejor legibilidad
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  buttonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    width: '100%',
  },
  secondaryButtonContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    width: '100%',
  },
});