import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDos from '../components/headerDos';
import httpClient from '../api/http';
import Sound from 'react-native-sound';
import { getIcon, getSound } from '../assets/assetsMap';
import AlphabetCard from '../components/cardComponent';

const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');
const { width: screenWidth } = Dimensions.get('window');
const DefaultIcon = require('../assets/icons/alpha.svg');

Sound.setCategory('Playback');

type AlphabetCard = {
  id: number;
  text: string;
  pronunciation: string;
  audioUrl: string | '../assets/sounds/alpha.mp3'; // "alpha"
  imageUrl: string | '../assets/icons/alpha.svg' ; // "alpha"
};

type ApiResponse = {
  success: boolean;
  data: AlphabetCard[];
};

type AlphabetCardProps = {
  card: AlphabetCard;
  onPlayAudio: (audioKey: string) => void;
};

console.log('datos:', AlphabetCard)

// --- Función para reproducir audio ---
const handlePlayAudio = (audioKey: string) => {
  if (!audioKey) return;

  const soundModule = getSound(audioKey);
  if (!soundModule) {
    console.warn('No se encontró el sonido:', audioKey);
    return;
  }

  const sound = new Sound(soundModule, (error) => {
    if (error) {
      console.error('Error al cargar sonido:', error);
      return;
    }
    sound.play((success) => {
      if (!success) console.warn('Error al reproducir sonido');
      sound.release();
    });
  });
};

// --- Componente hijo ---
const AlphabetCardComponent = ({ card, onPlayAudio }: AlphabetCardProps) => {
  const IconSource = card.imageUrl;
  console.log(IconSource)

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Image source={DefaultIcon} style={styles.icon} />
      </View>

      <Text style={styles.letter}>{card.text.charAt(0)}</Text>
      <Text style={styles.code}>{card.text}</Text>
      <Text style={styles.pronunciation}>{card.pronunciation}</Text>

      {card.audioUrl && (
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => onPlayAudio(card.audioUrl!)}
        >
          <Text style={styles.audioButtonText}>Reproducir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// --- Componente principal ---
export default function CardScreen() {
  const [alphabetData, setAlphabetData] = useState<AlphabetCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlphabetData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get<ApiResponse>('/aeronautical-alphabet');
      console.log('Datos recibidos del backend:', response.data);
      if (response.data.success) {
        setAlphabetData(response.data.data || []);
      } else {
        console.warn('API respondió con success=false');
        setAlphabetData([]);
      }
    } catch (error: any) {
      console.error('Error al obtener datos del alfabeto:', error.response?.data || error.message);
      setAlphabetData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlphabetData();
  }, []);

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

      <SafeAreaView style={styles.safeArea}>
        <HeaderDos />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Cargando alfabeto...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {alphabetData.map((card) => (
              <AlphabetCardComponent
                key={card.id}
                card={card}
                onPlayAudio={handlePlayAudio}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { zIndex: 10, flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
    flexGrow: 1,
    alignItems: 'center',
  },
  card: {
    width: screenWidth * 0.8,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#00BF63',
  },
  icon: { width: 80, height: 80, resizeMode: 'contain' },
  letter: { fontSize: 48, fontFamily: 'MontserratAlternates-Bold', color: '#0A4C40', marginBottom: 5 },
  code: { fontSize: 24, fontFamily: 'MontserratAlternates-SemiBold', color: '#333', marginBottom: 10, textAlign: 'center' },
  pronunciation: { fontSize: 18, fontFamily: 'MontserratAlternates-Regular', color: '#666', fontStyle: 'italic', marginBottom: 20, textAlign: 'center' },
  audioButton: { backgroundColor: '#00BF63', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25, elevation: 5 },
  audioButtonText: { color: 'white', fontFamily: 'MontserratAlternates-SemiBold', fontSize: 16 },
  loadingContainer: { height: 300, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: 'white', fontSize: 18, fontFamily: 'MontserratAlternates-Regular', marginTop: 10 },
});
