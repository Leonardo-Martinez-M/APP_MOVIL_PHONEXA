import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import HeaderDos from '../components/headerDos';
import httpClient from '../api/http';

const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');
const { width: screenWidth } = Dimensions.get('window');

// Configurar react-native-sound
Sound.setCategory('Playback');

type AlphabetCard = {
  id: number;
  text: string;
  pronunciation: string;
  audioUrl: string;
  imageUrl: string; // Esta es la URL de la imagen desde la API
};

type ApiResponse = {
  success: boolean;
  data: AlphabetCard[];
};

type AlphabetCardProps = {
  card: AlphabetCard;
  onPlayAudio: (audioUrl: string, cardId: number) => Promise<void>;
  isPlaying: boolean;
};

// --- Componente hijo ACTUALIZADO para imágenes desde API ---
const AlphabetCardComponent = ({ card, onPlayAudio, isPlaying }: AlphabetCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // URL completa de la imagen desde la API
  const imageUrl = card.imageUrl;

  console.log(`Card: ${card.text}, ImageURL: ${imageUrl}`);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {imageUrl && !imageError ? (
          <>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.icon} 
              resizeMode="contain"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                console.log('Error cargando imagen desde:', imageUrl);
                setImageError(true);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator size="small" color="#00BF63" />
              </View>
            )}
          </>
        ) : (
          <View style={styles.fallbackIconContainer}>
            <Text style={styles.fallbackIcon}>📝</Text>
            <Text style={styles.fallbackText}>{card.text.charAt(0)}</Text>
          </View>
        )}
      </View>

      <Text style={styles.letter}>{card.text.charAt(0)}</Text>
      <Text style={styles.code}>{card.text}</Text>
      <Text style={styles.pronunciation}>{card.pronunciation}</Text>

      <TouchableOpacity
        style={[styles.audioButton, isPlaying && styles.audioButtonPlaying]}
        onPress={() => onPlayAudio(card.audioUrl, card.id)}
        disabled={isPlaying}
      >
        <Text style={styles.audioButtonText}>
          {isPlaying ? '🔊 Reproduciendo...' : '🎵 Reproducir Sonido'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Componente principal ---
export default function CardScreen() {
  const [alphabetData, setAlphabetData] = useState<AlphabetCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const currentSoundRef = useRef<Sound | null>(null);

  // --- Función mejorada para reproducir audio ---
  const handlePlayAudio = async (audioUrl: string, cardId: number): Promise<void> => {
    return new Promise((resolve) => {
      try {
        // Si ya está reproduciendo este sonido, detenerlo
        if (playingId === cardId && currentSoundRef.current) {
          currentSoundRef.current.stop(() => {
            currentSoundRef.current?.release();
            currentSoundRef.current = null;
            setPlayingId(null);
            resolve();
          });
          return;
        }

        // Si hay otro sonido reproduciéndose, detenerlo primero
        if (currentSoundRef.current) {
          currentSoundRef.current.stop();
          currentSoundRef.current.release();
          currentSoundRef.current = null;
        }

        console.log("Cargando sonido desde:", audioUrl);
        setPlayingId(cardId);

        // Para URLs HTTP
        const sound = new Sound(audioUrl, null, (error) => {
          if (error) {
            console.error('Error al cargar desde URL:', error);
            Alert.alert('Error', 'No se pudo cargar el sonido');
            setPlayingId(null);
            resolve();
            return;
          }
          
          // Reproducir sonido cargado desde URL
          playSound(sound, cardId, resolve);
        });

      } catch (error) {
        console.error('Error general:', error);
        setPlayingId(null);
        resolve();
      }
    });
  };

  // Función auxiliar para reproducir el sonido
  const playSound = (sound: Sound, cardId: number, resolve: () => void) => {
    currentSoundRef.current = sound;
    
    sound.play((success) => {
      if (success) {
        console.log('Sonido reproducido con éxito');
      } else {
        console.log('Error al reproducir sonido');
        Alert.alert('Error', 'No se pudo reproducir el sonido');
      }
      
      // Limpiar después de reproducir
      sound.release();
      if (currentSoundRef.current === sound) {
        currentSoundRef.current = null;
      }
      setPlayingId(null);
      resolve();
    });
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (currentSoundRef.current) {
        currentSoundRef.current.stop();
        currentSoundRef.current.release();
        currentSoundRef.current = null;
      }
    };
  }, []);

  const fetchAlphabetData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get<ApiResponse>('/aeronautical-alphabet');
      console.log('Datos recibidos del backend:', response.data);
      
      if (response.data.success) {
        // Log para debug de los datos
        response.data.data.forEach(card => {
          console.log(`Card: ${card.text}, ImageUrl: ${card.imageUrl}`);
        });
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
        ) : alphabetData.length > 0 ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {alphabetData.map((card) => {
              const isPlaying = playingId === card.id;
              
              return (
                <AlphabetCardComponent
                  key={card.id}
                  card={card}
                  onPlayAudio={handlePlayAudio}
                  isPlaying={isPlaying}
                />
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudieron cargar los datos</Text>
            <TouchableOpacity onPress={fetchAlphabetData} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- Estilos ACTUALIZADOS ---
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
    marginBottom: 15,
    overflow: 'hidden', // Para que la imagen no se salga del contenedor
  },
  icon: { 
    width: '100%', 
    height: '100%',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackIcon: { 
    fontSize: 40,
    marginBottom: 5,
    color: 'white',
  },
  fallbackText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  letter: { 
    fontSize: 48, 
    fontFamily: 'MontserratAlternates-Bold', 
    color: '#0A4C40', 
    marginBottom: 5 
  },
  code: { 
    fontSize: 24, 
    fontFamily: 'MontserratAlternates-SemiBold', 
    color: '#333', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  pronunciation: { 
    fontSize: 18, 
    fontFamily: 'MontserratAlternates-Regular', 
    color: '#666', 
    fontStyle: 'italic', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  audioButton: { 
    backgroundColor: '#00BF63', 
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderRadius: 25, 
    elevation: 5 
  },
  audioButtonPlaying: {
    backgroundColor: '#0A4C40',
    opacity: 0.8,
  },
  audioButtonText: { 
    color: 'white', 
    fontFamily: 'MontserratAlternates-SemiBold', 
    fontSize: 16 
  },
  loadingContainer: { 
    height: 300, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    color: 'white', 
    fontSize: 18, 
    fontFamily: 'MontserratAlternates-Regular', 
    marginTop: 10 
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    color: 'white', 
    fontSize: 18, 
    marginBottom: 20 
  },
  retryButton: { 
    backgroundColor: 'white', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 10 
  },
  retryButtonText: { 
    color: '#00BF63', 
    fontWeight: 'bold' 
  },
});