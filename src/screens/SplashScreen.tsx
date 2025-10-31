// Copia y usa este código en src/screens/SplashScreen.tsx

import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, StatusBar } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import LinearGradient from 'react-native-linear-gradient';

// --- RUTAS DE TUS IMÁGENES ---
const AvionImage = require('../assets/images/avion.png');
const PhonexaText = require('../assets/images/Phonexa.png'); // Usa el nombre exacto de tu archivo
const BackgroundAbstract = require('../assets/images/bg-image.png');

const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];

interface SplashScreenProps {
  onAnimationEnd: () => void;
}

const SplashScreen = ({ onAnimationEnd }: SplashScreenProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. OCULTA EL SPLASH NATIVO: Transiciona del nativo a este componente JS.
    BootSplash.hide({ fade: true });

    // 2. SECUENCIA DE ANIMACIÓN: Retardo + Zoom/Fade de salida
    Animated.sequence([
      Animated.delay(1500), // Muestra el logo completo por 1.5 segundos
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 5, // Zoom out grande
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0, // Desvanecer
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start(onAnimationEnd);
  }, [onAnimationEnd, scaleAnim, opacityAnim]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  };

  return (
    <Animated.View style={[styles.fullScreen, animatedStyle]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* 1. Fondo de Degradado Principal (Capa 1) */}
      <LinearGradient
        colors={GRADIENT_COLORS}
        style={styles.fullScreen}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* 2. Capa del Fondo Abstracto (Capa 2: sobre el degradado con baja opacidad) */}
        <Image
          source={BackgroundAbstract}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* 3. Contenedor del Logo y Texto (Avión + PHONEXA) */}
        <View style={styles.logoContainer}>
          <Image
            source={AvionImage}
            style={styles.avion}
            resizeMode="contain"
          />
          <Image
            source={PhonexaText}
            style={styles.phonexa}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

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
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avion: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  phonexa: {
    width: 250,
    height: 40,
  }
});

export default SplashScreen;