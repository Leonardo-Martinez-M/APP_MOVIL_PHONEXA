import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ButtonMenu from '../components/buttonSecond';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderUno from '../components/headerUno';
const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');

export default function HomeScreen() {

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
      {/* Cabecera */}
      < SafeAreaView>
        <HeaderUno />
      </SafeAreaView>

      {/* Cuerpo */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <ButtonMenu />
        </View>

      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { zIndex: 10, },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.90, width: '100%', height: '100%', },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 150,  },
  welcomeSection: { alignItems: 'center', marginTop: 40, marginBottom: 50,},
  menuSection: {width: '100%', height: '100%'},
  welcomeText: { fontSize: 26,     fontFamily: 'MontserratAlternates-SemiBold',
 color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, },
});