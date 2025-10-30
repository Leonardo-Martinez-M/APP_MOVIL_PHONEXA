import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDos from '../components/headerDos';
import httpClient from '../api/http';
import Sound from 'react-native-sound';
import { SvgUri } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');
const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');

Sound.setCategory('Playback');

// --- Tipos ---
type AlphabetCardType = {
  id: number;
  text: string;
  pronunciation: string;
  audioUrl: string;
  imageUrl: string;
};

type ApiResponse = {
  success: boolean;
  data: AlphabetCardType[];
};

// --- Componente de Tarjeta Integrado ---
const AlphabetCardIntegrated = ({
  card,
  onPlayAudio,
  isPlaying,
  disabled
}: {
  card: AlphabetCardType;
  onPlayAudio: (audioUrl: string, cardId: number) => void;
  isPlaying: boolean;
  disabled: boolean;
}) => {
  console.log(`[CARD ${card.id}] Renderizando - Imagen: ${card.imageUrl}`);

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.iconContainer}>
        <SvgUri
          uri={card.imageUrl}
          width="60%"
          height="60%"
          onError={(e) => console.log(`[CARD ${card.id}] Error cargando imagen:`, e)}
          onLoad={() => console.log(`[CARD ${card.id}] Imagen cargada exitosamente`)}
        />
      </View>

      <Text style={cardStyles.letter}>{card.text.charAt(0)}</Text>
      <Text style={cardStyles.code}>{card.text}</Text>
      <Text style={cardStyles.pronunciation}>{card.pronunciation}</Text>

      {card.audioUrl && (
        <TouchableOpacity
          style={[
            cardStyles.audioButton,
            isPlaying && cardStyles.audioButtonPlaying,
            disabled && cardStyles.audioButtonDisabled
          ]}
          onPress={() => onPlayAudio(card.audioUrl, card.id)}
          disabled={disabled && !isPlaying}
        >
          <Text style={cardStyles.audioButtonText}>
            {isPlaying ? 'Reproduciendo...' : 'Reproducir Pronunciación'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// --- Estilos de la Tarjeta ---
const cardStyles = StyleSheet.create({
  card: {
    width: screenWidth * 0.8, // 80% del ancho de pantalla
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: (screenWidth * 0.2) / 4, // Esto centra la card - 20% restante dividido entre los márgenes
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0A4C40',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#00BF63',
  },
  letter: {
    fontSize: 48,
    fontFamily: 'MontserratAlternates-Bold',
    color: '#0A4C40',
    marginBottom: 5,
    marginTop: 10,
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
    elevation: 5,
    minWidth: 200,
    alignItems: 'center',
  },
  audioButtonPlaying: {
    backgroundColor: '#FFA500',
  },
  audioButtonDisabled: {
    backgroundColor: '#CCCCCC',
    elevation: 0,
  },
  audioButtonText: {
    color: 'white',
    fontFamily: 'MontserratAlternates-SemiBold',
    fontSize: 16,
    textAlign: 'center'
  },
});

// --- Componente Principal de la Pantalla ---
export default function CardScreen() {
  const [alphabetData, setAlphabetData] = useState<AlphabetCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [audioDisabled, setAudioDisabled] = useState(false);

  // Función para manejar la reproducción de audio
  const handlePlayAudio = useCallback(async (audioUrl: string, cardId: number) => {
    console.log(`[AUDIO] Botón presionado - Card ID: ${cardId}, URL: ${audioUrl}`);

    if (audioDisabled) {
      console.log(`[AUDIO] Audio deshabilitado, ignorando click`);
      return;
    }

    if (!audioUrl) {
      Alert.alert('Error', 'No hay URL de audio disponible');
      return;
    }

    // Deshabilitar todos los botones y marcar como reproduciendo
    setAudioDisabled(true);
    setCurrentlyPlaying(cardId);

    console.log(`[AUDIO] Iniciando reproducción para card ${cardId}`);

    try {
      const sound = new Sound(audioUrl, '', (error) => {
        if (error) {
          console.error(`[AUDIO] Error al cargar sonido para card ${cardId}:`, error);
          Alert.alert('Error', 'No se pudo cargar el audio');
          setCurrentlyPlaying(null);
          setAudioDisabled(false);
          return;
        }

        console.log(`[AUDIO] Audio cargado correctamente, reproduciendo...`);

        sound.play((success) => {
          if (success) {
            console.log(`[AUDIO] Audio reproducido correctamente para card ${cardId}`);
          } else {
            console.warn(`[AUDIO] Error al reproducir sonido para card ${cardId}`);
            Alert.alert('Error', 'No se pudo reproducir el audio');
          }

          // Limpiar estado después de la reproducción
          setCurrentlyPlaying(null);
          setAudioDisabled(false);
          sound.release();
        });
      });
    } catch (error) {
      console.error(`[AUDIO] Error inesperado:`, error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
      setCurrentlyPlaying(null);
      setAudioDisabled(false);
    }
  }, [audioDisabled]);

  // Función para obtener datos
  const fetchAlphabetData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('[API] Solicitando datos de la API...');

      const response = await httpClient.get<ApiResponse>('/aeronautical-alphabet');

      if (response.data.success) {
        const data = response.data.data || [];
        console.log('[API] Datos recibidos:', data.length, 'elementos');

        // Log detallado de cada elemento
        data.forEach(item => {
          console.log(`[API] Item ${item.id}:`, {
            text: item.text,
            imageUrl: item.imageUrl,
            audioUrl: item.audioUrl,
            pronunciation: item.pronunciation
          });
        });

        setAlphabetData(data);
      } else {
        console.warn('[API] API respondió con success=false');
        setAlphabetData([]);
      }
    } catch (error: any) {
      console.error('[API] Error al obtener datos:', error);
      console.error('[API] Detalles del error:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudieron cargar los datos del alfabeto');
      setAlphabetData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlphabetData();
  }, [fetchAlphabetData]);

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
            pagingEnabled
            snapToInterval={screenWidth} // Esto es clave - usa el ancho completo de pantalla
            snapToAlignment="center"
            decelerationRate="fast"
          >
            {alphabetData.map((card) => (
              <AlphabetCardIntegrated
                key={card.id}
                card={card}
                onPlayAudio={handlePlayAudio}
                isPlaying={currentlyPlaying === card.id}
                disabled={audioDisabled && currentlyPlaying !== card.id}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudieron cargar los datos</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchAlphabetData}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- Estilos de la Pantalla ---
const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { zIndex: 10, flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 150,
    // Padding horizontal calculado para centrado perfecto
    paddingHorizontal: (screenWidth - (screenWidth * 0.8)) / 2,
  },
  loadingContainer: {
    flex: 1,
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
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'MontserratAlternates-Regular',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00BF63',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontFamily: 'MontserratAlternates-SemiBold',
    fontSize: 16,
  },
});