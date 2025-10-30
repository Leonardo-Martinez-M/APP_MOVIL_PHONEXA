import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import HeaderUno from '../components/headerUno';

const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');

// Importar ambas animaciones
const FireAnimation = require('../assets/animations/Fire.json');
const SadAnimation = require('../assets/animations/Sad.json');

export default function StreakScreen({ route, navigation }: any) {
  const { streak = 0, savedStreak = 0 } = route.params || {};
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Manejar botón de retroceso físico
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home');
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const handlePlayAgain = () => {
    console.log('[STREAK] Continuando racha:', savedStreak);
    navigation.replace('Quiz', { savedStreak: savedStreak });
  };

  const handleNewGame = () => {
    console.log('[STREAK] Iniciando nuevo juego');
    navigation.replace('Quiz', { savedStreak: 0 });
  };

  // const handleGoHome = () => {
  //   console.log('[STREAK] Navegando a Home');
  //   navigation.navigate('Home');
  // };

  // Determinar qué animación mostrar
  const showFireAnimation = streak > 0;
  const animationSource = showFireAnimation ? FireAnimation : SadAnimation;
  const animationSize = showFireAnimation ? 200 : 150;

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
      <SafeAreaView>
        <HeaderUno />
      </SafeAreaView>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          {/* Título */}
          <Text style={styles.title}>Racha de preguntas</Text>
          <Text style={styles.subtitle}>contestadas correctamente</Text>

          {/* Animación */}
          <View style={styles.animationContainer}>
            <LottieView
              source={animationSource}
              autoPlay
              loop
              style={[styles.animation, { width: animationSize, height: animationSize }]}
            />

            {/* Número de Racha */}
            <View style={styles.streakNumberContainer}>
              <Text style={[
                styles.streakNumber,
                !showFireAnimation && styles.streakNumberSad
              ]}>
                {streak}
              </Text>
            </View>
          </View>

          {/* Mensaje según la racha */}
          <Text style={styles.message}>
            {streak === 0
              ? '¡Sigue practicando!'
              : streak < 5
                ? '¡Buen trabajo!'
                : streak < 10
                  ? '¡Impresionante!'
                  : '¡Eres un experto!'}
          </Text>

          {/* Información de racha guardada */}
          {savedStreak > 0 && streak === 0 && (
            <View style={styles.savedInfo}>
              <Text style={styles.savedText}>
                Tienes una racha guardada de {savedStreak}
              </Text>
            </View>
          )}

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.playAgainButton]}
              onPress={handlePlayAgain}
            >
              <Text style={styles.buttonText}>
                {savedStreak > 0 ? 'Continuar Racha' : 'Jugar Nuevamente'}
              </Text>
            </TouchableOpacity>

            {savedStreak > 0 && (
              <TouchableOpacity
                style={[styles.button, styles.newGameButton]}
                onPress={handleNewGame}
              >
                <Text style={styles.buttonText}>Nuevo Juego</Text>
              </TouchableOpacity>
            )}

            {/* <TouchableOpacity
              style={[styles.button, styles.homeButton]}
              onPress={handleGoHome}
            >
              <Text style={styles.buttonText}>Ir al Inicio</Text>
            </TouchableOpacity> */}
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    width: '90%'
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontFamily: 'MontserratAlternates-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 120,
    opacity: 0.9,
  },
  animationContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  animation: {
    position: 'absolute',
  },
  streakNumberContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakNumber: {
    paddingBottom: 250,
    fontSize: 100,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  streakNumberSad: {
    fontSize: 42,
    color: '#ff3d3ddf',
  },
  message: {
    fontSize: 24,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  savedInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  savedText: {
    color: 'white',
    fontFamily: 'MontserratAlternates-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 50
  },
  playAgainButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  newGameButton: {
    backgroundColor: '#0A4C40',
  },
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'MontserratAlternates-Bold',
    fontSize: 16,
  },
});