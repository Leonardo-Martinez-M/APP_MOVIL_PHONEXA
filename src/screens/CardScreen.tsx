import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDos from '../components/headerDos';
import httpClient from '../api/http';
import Sound from 'react-native-sound';
import { SvgUri } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@AlphabetData';
const { width: screenWidth } = Dimensions.get('window');
const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');

Sound.setCategory('Playback');

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

// Contador global de solicitudes
let apiRequestCount = 0;

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
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.iconContainer}>
        <SvgUri
          uri={card.imageUrl}
          width="60%"
          height="60%"
          onError={(e) => console.log(`[CARD ${card.id}] Error cargando imagen:`, e)}
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

const cardStyles = StyleSheet.create({
  card: {
    marginTop: '1.3%',
    width: screenWidth * 0.8,
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: (screenWidth * 0.2) / 4,
    borderWidth: 2,
    borderColor: '#0a4c40f3',
  },
  iconContainer: {
    width: 220,
    height: 140,
    borderRadius: 30,
    backgroundColor: '#0A4C40',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#21392eff',
  },
  letter: {
    fontSize: 60,
    fontFamily: 'MontserratAlternates-Bold',
    color: '#0A4C40',
    marginBottom: 5,
    marginTop: 10,
  },
  code: {
    fontSize: 26,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center'
  },
  pronunciation: {
    fontSize: 20,
    fontFamily: 'MontserratAlternates-Regular',
    color: '#000000ff',
    fontStyle: 'italic',
    marginBottom: 40,
    textAlign: 'center'
  },
  audioButton: {
    //backgroundColor: '#00BF63',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 25,
    elevation: 5,
    minWidth: 200,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
    backgroundColor: '#0A4C40',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
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
    fontSize: 15,
    textAlign: 'center'
  },
});

export default function CardScreen() {
  const [alphabetData, setAlphabetData] = useState<AlphabetCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [audioDisabled, setAudioDisabled] = useState(false);
  const hasLoadedData = useRef(false);

  const handlePlayAudio = useCallback(async (audioUrl: string, cardId: number) => {
    if (audioDisabled) return;

    if (!audioUrl) {
      Alert.alert('Error', 'No hay URL de audio disponible');
      return;
    }

    setAudioDisabled(true);
    setCurrentlyPlaying(cardId);

    try {
      const sound = new Sound(audioUrl, '', (error) => {
        if (error) {
          console.error(`[AUDIO] Error al cargar sonido:`, error);
          Alert.alert('Error', 'No se pudo cargar el audio');
          setCurrentlyPlaying(null);
          setAudioDisabled(false);
          return;
        }

        sound.play((success) => {
          if (success) {
            console.log(`[AUDIO] Audio reproducido correctamente`);
          } else {
            Alert.alert('Error', 'No se pudo reproducir el audio');
          }

          setCurrentlyPlaying(null);
          setAudioDisabled(false);
          sound.release();
        });
      });
    } catch (error) {
      console.error(`[AUDIO] Error inesperado:`, error);
      setCurrentlyPlaying(null);
      setAudioDisabled(false);
    }
  }, [audioDisabled]);

  const fetchAlphabetData = useCallback(async () => {
    // Evitar múltiples solicitudes
    if (hasLoadedData.current) {
      console.log('[CACHE] Los datos ya están cargados, evitando solicitud redundante');
      return;
    }

    try {
      setLoading(true);

      // Intentar cargar desde caché local primero
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData: AlphabetCardType[] = JSON.parse(storedData);
        console.log('[CACHE] Datos cargados desde caché local:', parsedData.length, 'elementos');
        setAlphabetData(parsedData);
        hasLoadedData.current = true;
        setLoading(false);
        return;
      }

      // Solo hacer solicitud a API si no hay datos en caché
      apiRequestCount++;
      console.log(`[API] Realizando solicitud a la API (#${apiRequestCount})...`);

      const response = await httpClient.get<ApiResponse>('/aeronautical-alphabet');

      if (response.data.success) {
        const data = response.data.data || [];
        console.log(`[API] Datos recibidos exitosamente:`, data.length, 'elementos');

        // Guardar en caché local para futuras sesiones
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        hasLoadedData.current = true;

        setAlphabetData(data);
      } else {
        console.warn('[API] API respondió con success=false');
        setAlphabetData([]);
      }
    } catch (error: any) {
      console.error('[FETCH] Error al obtener datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del alfabeto');
      setAlphabetData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    // Forzar recarga limpiando caché y resetear flag
    AsyncStorage.removeItem(STORAGE_KEY);
    hasLoadedData.current = false;
    fetchAlphabetData();
  }, [fetchAlphabetData]);

  useEffect(() => {
    fetchAlphabetData();
  }, [fetchAlphabetData]);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
        <HeaderDos />

        <SafeAreaView style={styles.safeArea}>
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
              snapToInterval={screenWidth}
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
                onPress={handleRetry}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { zIndex: 10, flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 150,
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