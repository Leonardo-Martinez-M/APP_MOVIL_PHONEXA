/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  //SafeAreaView // Añadido para manejar el área segura del notch
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderUno from '../components/headerUno';

const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');

const ButtonWithIcon = ({ icon, text, onPress }: any) => (
  <TouchableOpacity style={styles.mainButton} onPress={onPress}>
    <Icon name={icon} size={24} color="white" style={styles.mainButtonIcon} />
    <Text style={styles.mainButtonText}>{text}</Text>
  </TouchableOpacity>
);


// --- Componente Principal ---
export default function HomeScreen({ navigation }: any) {
  const userName = 'User'; // Nombre de usuario de ejemplo

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


      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Sección de Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bienvenido, {userName}</Text>
        </View>

        {/* Sección de Botones Principales */}
        <View style={styles.mainButtonSection}>
          <ButtonWithIcon
            icon="book-open-variant"
            text="APRENDER EL ALFABETO"
            onPress={() => navigation.navigate('Alphabet')}
          />

          <ButtonWithIcon icon="microphone-outline" text="PRACTICAR PRONUNCIACIÓN" onPress={() => { }} />
          <ButtonWithIcon icon="trophy-award" text="CUESTIONARIOS Y RETOS" onPress={() => { }} />

          <TouchableOpacity style={[styles.mainButton, styles.disabledButton]} disabled>
            <Text style={styles.mainButtonText}>PRÓXIMAMENTE...</Text>
          </TouchableOpacity>
        </View>

        {/* Espacio para que el contenido no quede tapado por la botonera inferior */}
        <View style={{ height: 100 }} />
      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { zIndex: 10, },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.90, width: '100%', height: '100%', },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120, },
  welcomeSection: { alignItems: 'center', marginTop: 40, marginBottom: 50, },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, },
  mainButtonSection: { width: '100%', alignItems: 'center', marginBottom: 40, },
  mainButton: { backgroundColor: 'rgba(0, 0, 0, 0.6)', flexDirection: 'row', alignItems: 'center', borderRadius: 25, paddingVertical:  25, paddingHorizontal: 25, width: '100%', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', },
  mainButtonIcon: { marginRight: 15},
  mainButtonText: { color: 'white', fontSize: 16, fontWeight: '600', flex: 1},
  disabledButton: { opacity: 0.8, backgroundColor: 'rgba(0, 0, 0, 0.3)', },
});