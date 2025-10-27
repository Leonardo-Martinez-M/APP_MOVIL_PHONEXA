import * as React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ButtonMenu from '../components/buttonSecond';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDos from '../components/headerDos';

const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');
const { width: screenWidth } = Dimensions.get('window');

// Tipo para las cartas del alfabeto
type AlphabetCard = {
  idAlphabet: number;
  letter: string;
  code: string;
  pronunciation: string;
  audioUrl: string | null;
  iconUrl: string | null;
};

export default function CardScreen() {
  const [alphabetData, setAlphabetData] = React.useState<AlphabetCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [defaultCard, setDefaultCard] = React.useState<AlphabetCard | null>(null);

  // Obtener datos del alfabeto
  const fetchAlphabetData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.114:3000/aeronautical-alphabet');
      const data = await response.json();
      setAlphabetData(data);
      
      // Encontrar la carta por defecto (A)
      const defaultA = data.find((card: AlphabetCard) => card.letter === 'A');
      setDefaultCard(defaultA);
    } catch (error) {
      console.error('Error fetching alphabet data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAlphabetData();
  }, []);

  // Función para obtener la URL del icono, si no existe usa el por defecto
  const getIconUrl = (card: AlphabetCard) => {
    return card.iconUrl || defaultCard?.iconUrl || '../assets/icons/alpha.svg';
  };

  // Función para obtener la URL del audio, si no existe usa el por defecto
  const getAudioUrl = (card: AlphabetCard) => {
    return card.audioUrl || defaultCard?.audioUrl || '../assets/sounds/alpha.mp3';
  };

  // Función para reproducir audio (placeholder)
  const playAudio = (audioUrl: string) => {
    // Aquí iría la lógica para reproducir el audio
    console.log('Reproduciendo audio:', audioUrl);
    // Ejemplo con react-native-sound o similar
    // SoundPlayer.playSound(audioUrl);
  };

  // Componente individual de carta
  const AlphabetCardComponent = ({ card }: { card: AlphabetCard }) => (
    <View style={styles.card}>
      {/* Icono */}
      <View style={styles.iconContainer}>
        <Image 
          source={{ uri: getIconUrl(card) }}
          style={styles.icon}
          defaultSource={require('../assets/icons/alpha.svg')} // Imagen por defecto
          onError={() => console.log('Error loading image for:', card.letter)}
        />
      </View>

      {/* Letra */}
      <Text style={styles.letter}>{card.letter}</Text>
      
      {/* Código (Alpha, Bravo, etc.) */}
      <Text style={styles.code}>{card.code}</Text>
      
      {/* Pronunciación */}
      <Text style={styles.pronunciation}>{card.pronunciation}</Text>

      {/* Botón de audio */}
      <TouchableOpacity 
        style={styles.audioButton}
        onPress={() => playAudio(getAudioUrl(card))}
      >
        <Text style={styles.audioButtonText}>🔊 Reproducir</Text>
      </TouchableOpacity>
    </View>
  );

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
      <SafeAreaView style={styles.safeArea}>
        <HeaderDos />
      </SafeAreaView>

      {/* Cuerpo */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Alfabeto Aeronáutico</Text>
        </View>

        {/* Scroll horizontal para las cartas */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando cartas...</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              snapToInterval={screenWidth * 0.8 + 20} // Para efecto snap
              decelerationRate="fast"
            >
              {alphabetData.map((card) => (
                <AlphabetCardComponent key={card.idAlphabet} card={card} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Indicador de scroll */}
        <View style={styles.scrollIndicator}>
          <Text style={styles.scrollIndicatorText}>
            Desliza hacia los lados para ver más cartas
          </Text>
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
  fullScreen: { 
    flex: 1 
  },
  safeArea: { 
    zIndex: 10 
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
    width: '100%',
    height: '100%',
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 150,
    flexGrow: 1,
  },
  welcomeSection: { 
    alignItems: 'center', 
    marginTop: 40, 
    marginBottom: 30 
  },
  menuSection: { 
    width: '100%', 
    marginTop: 40 
  },
  welcomeText: {
    fontSize: 26,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardsContainer: {
    height: 400,
    marginBottom: 20,
  },
  horizontalScrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  card: {
    width: screenWidth * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#00BF63',
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  letter: {
    fontSize: 48,
    fontFamily: 'MontserratAlternates-Bold',
    color: '#0A4C40',
    marginBottom: 5,
  },
  code: {
    fontSize: 24,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  pronunciation: {
    fontSize: 18,
    fontFamily: 'MontserratAlternates-Regular',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  audioButton: {
    backgroundColor: '#00BF63',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  audioButtonText: {
    color: 'white',
    fontFamily: 'MontserratAlternates-SemiBold',
    fontSize: 16,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'MontserratAlternates-Regular',
  },
  scrollIndicator: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  scrollIndicatorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'MontserratAlternates-Regular',
    fontStyle: 'italic',
  },
});