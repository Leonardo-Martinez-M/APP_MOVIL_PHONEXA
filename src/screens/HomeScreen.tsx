import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView // Añadido para manejar el área segura del notch
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');

// --- Componentes Reutilizables ---
const ButtonWithIcon = ({ icon, text, onPress }: any) => (
  <TouchableOpacity style={styles.mainButton} onPress={onPress}>
    <Icon name={icon} size={24} color="white" style={styles.mainButtonIcon} />
    <Text style={styles.mainButtonText}>{text}</Text>
  </TouchableOpacity>
);

// ELIMINAMOS FooterIcon

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

      {/* CABECERA: La integramos dentro del contenido con SafeAreaView */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View /> {/* Espacio vacío para balancear */}
          <Icon name="airplane-takeoff" size={40} color="white" />
        </View>
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

      {/* ELIMINAMOS el Menú de Navegación Inferior (Footer) */}
    </LinearGradient>
  );
}

// --- Hoja de Estilos (Modificada) ---
const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { zIndex: 10, }, // Nuevo estilo para el área segura
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.2, width: '100%', height: '100%', },
  // Modificado: paddingTop eliminado del header y aplicado a SafeAreaView
  header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120, },
  welcomeSection: { alignItems: 'center', marginTop: 40, marginBottom: 50, },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, },
  mainButtonSection: { width: '100%', alignItems: 'center', marginBottom: 40, },
  mainButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 15, paddingVertical: 15, paddingHorizontal: 25, width: '100%', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', },
  mainButtonIcon: { marginRight: 15, },
  mainButtonText: { color: 'white', fontSize: 16, fontWeight: '600', flex: 1, },
  disabledButton: { opacity: 0.6, backgroundColor: 'rgba(0, 0, 0, 0.3)', },
  // ELIMINAMOS el estilo 'footer'
});