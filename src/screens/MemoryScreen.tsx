import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDos from '../components/headerDos';
import httpClient from '../api/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';

// ========== CONFIGURACIONES Y TIPOS ==========
const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');

type QuizItem = {
  id: number;
  answer: string;
  imgUnoUrl: string;
  imgDosUrl: string;
  imgTresUrl: string;
  imgCuatroUrl: string;
};

type QuizResponse = QuizItem[];

const STORAGE_QUIZ_KEY = '@QuizData';
const STORAGE_USED_ITEMS_KEY = '@UsedQuizItems';

const MemoryScreen = () => {
  // ========== ESTADOS ==========
  const [quizData, setQuizData] = useState<QuizItem[]>([]);
  const [usedItems, setUsedItems] = useState<number[]>([]);
  const [currentItem, setCurrentItem] = useState<QuizItem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // ========== REFS PARA EVITAR DEPENDENCIAS CIRCULARES ==========
  const scoreRef = useRef(score);
  const totalAnsweredRef = useRef(totalAnswered);
  const quizDataRef = useRef(quizData);
  const usedItemsRef = useRef(usedItems);

  const resetGameRef = useRef<() => void>(() => { });


  // Actualizar refs cuando los estados cambien
  useEffect(() => {
    scoreRef.current = score;
    totalAnsweredRef.current = totalAnswered;
    quizDataRef.current = quizData;
    usedItemsRef.current = usedItems;
  }, [score, totalAnswered, quizData, usedItems]);

  // ========== FUNCIONES PRINCIPALES ==========

  const selectNextItemImplementation = useCallback((data: QuizItem[], used: number[]) => {
    if (data.length === 0) return;

    const availableItems = data.filter(item => !used.includes(item.id));

    if (availableItems.length === 0) {
      Alert.alert(
        '¡Felicidades!',
        `Has completado todas las letras. Puntuación: ${scoreRef.current}/${totalAnsweredRef.current}`,
        [{ text: 'Jugar de nuevo', onPress: () => resetGameRef.current() }]
      );
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const selectedItem = availableItems[randomIndex];

    setCurrentItem(selectedItem);
    setImagesLoaded(0);
    setUserAnswer('');
    setSubmitted(false);



 // Precargar el siguiente ítem aleatorio
  const remainingItems = availableItems.filter((_, index) => index !== randomIndex);
  if (remainingItems.length > 0) {
    const nextRandomIndex = Math.floor(Math.random() * remainingItems.length);
    const nextItem = remainingItems[nextRandomIndex];
    
    // Precargar las imágenes del próximo ítem
    const imageUrls = [nextItem.imgUnoUrl, nextItem.imgDosUrl, nextItem.imgTresUrl, nextItem.imgCuatroUrl];
    imageUrls.forEach(url => {
      Image.prefetch(url).catch(e => console.log('Error precargando imagen', url, e));
    });
  }
    const newUsedItems = [...used, selectedItem.id];
    setUsedItems(newUsedItems);
    AsyncStorage.setItem(STORAGE_USED_ITEMS_KEY, JSON.stringify(newUsedItems));

  }, []);

  /**
   * Función auxiliar sin dependencias para resetear juego
   */
  const resetGameImplementation = useCallback(async () => {
    setUsedItems([]);
    setScore(0);
    setTotalAnswered(0);
    await AsyncStorage.setItem(STORAGE_USED_ITEMS_KEY, JSON.stringify([]));

    if (quizDataRef.current.length > 0) {
      selectNextItemImplementation(quizDataRef.current, []);
    }
  }, [selectNextItemImplementation]);

  resetGameRef.current = resetGameImplementation;


  const resetGame = useCallback(() => {
    resetGameImplementation();
  }, [resetGameImplementation]);

  // ========== CARGA DE DATOS ==========

  // ========== CARGA DE DATOS ==========

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setLoading(true);

        // 1. Primero intentar cargar desde el cache
        const cachedData = await loadFromCache();
        if (cachedData) {
          console.log('✅ Usando datos desde cache');
          setQuizData(cachedData);

          // Cargar items ya utilizados
          const storedUsedItems = await AsyncStorage.getItem(STORAGE_USED_ITEMS_KEY);
          const usedItemsArray = storedUsedItems ? JSON.parse(storedUsedItems) : [];
          setUsedItems(usedItemsArray);

          // Iniciar juego con primer item
          selectNextItemImplementation(cachedData, usedItemsArray);
          setLoading(false);
          return;
        }

        // 2. Si no hay cache, cargar desde API
        console.log('📥 No hay cache, cargando desde API...');
        const response = await httpClient.get<QuizResponse>('/memory');

        if (response.data) {
          setQuizData(response.data);
          console.log('✅ Quiz data loaded from API:', response.data.length, 'items');
          await AsyncStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(response.data));

          // Cargar items ya utilizados
          const storedUsedItems = await AsyncStorage.getItem(STORAGE_USED_ITEMS_KEY);
          const usedItemsArray = storedUsedItems ? JSON.parse(storedUsedItems) : [];
          setUsedItems(usedItemsArray);

          // Iniciar juego con primer item
          selectNextItemImplementation(response.data, usedItemsArray);
        }
      } catch (error) {
        console.error('Error loading quiz data:', error);
        // Fallback: cargar desde almacenamiento local (esto ya no debería ser necesario porque primero intentamos cache)
        await loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromCache = async (): Promise<QuizItem[] | null> => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_QUIZ_KEY);
        if (storedData) {
          return JSON.parse(storedData);
        }
        return null;
      } catch (error) {
        console.error('Error loading from cache:', error);
        return null;
      }
    };

    const loadFromLocalStorage = async () => {
      // Esta función es igual a loadFromCache, pero por compatibilidad la dejamos
      const storedData = await AsyncStorage.getItem(STORAGE_QUIZ_KEY);
      if (storedData) {
        const parsedData: QuizItem[] = JSON.parse(storedData);
        setQuizData(parsedData);
        const storedUsedItems = await AsyncStorage.getItem(STORAGE_USED_ITEMS_KEY);
        const usedItemsArray = storedUsedItems ? JSON.parse(storedUsedItems) : [];
        setUsedItems(usedItemsArray);
        selectNextItemImplementation(parsedData, usedItemsArray);
      } else {
        Alert.alert('Error', 'No se pudieron cargar las preguntas');
      }
    };

    loadQuizData();
  }, [selectNextItemImplementation]);

  // ========== MANEJADORES DE ACCIONES ==========

  const handleSubmit = () => {
    if (!currentItem || !userAnswer.trim()) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentItem.answer.toLowerCase();
    console.log("✏️ Respuesta del usuario:", userAnswer);
    console.log("🔤 Respuesta correcta:", currentItem.answer);
    setSubmitted(true);
    setTotalAnswered(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Esperar y pasar a siguiente pregunta
    const delay = isCorrect ? 1500 : 2000;
    setTimeout(() => {
      selectNextItemImplementation(quizDataRef.current, usedItemsRef.current);
    }, delay);
  };

  const handleSkip = () => {
    if (!currentItem) return;
    setTotalAnswered(prev => prev + 1);
    selectNextItemImplementation(quizDataRef.current, usedItemsRef.current);
  };

  // ========== RENDERIZADO ==========

  if (loading) {
    return (
      <LinearGradient colors={GRADIENT_COLORS} style={styles.fullScreen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cargando juego...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient colors={GRADIENT_COLORS} style={styles.fullScreen}>
        <Image source={BackgroundAbstract} resizeMode="cover" style={styles.backgroundImage} />
        <HeaderDos />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>
              <Text style={styles.title}>ADIVINA LA LETRA</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {score}/{totalAnswered} • Progreso: {usedItems.length}/{quizData.length}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              A partir de las siguientes 4 imágenes trata de identificar qué letra es y escríbela,
              después envía la respuesta
            </Text>

            {currentItem && (
              <View style={styles.imagesGrid}>
                <View style={styles.imageRow}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: currentItem.imgUnoUrl }}
                      style={styles.image}
                      resizeMode="contain"
                      onLoad={() => setImagesLoaded(prev => prev + 1)}
                      onError={() => setImagesLoaded(prev => prev + 1)}
                    />
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: currentItem.imgDosUrl }}
                      style={styles.image}
                      resizeMode="contain"
                      onLoad={() => setImagesLoaded(prev => prev + 1)}
                      onError={() => setImagesLoaded(prev => prev + 1)}
                    />
                  </View>
                </View>
                <View style={styles.imageRow}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: currentItem.imgTresUrl }}
                      style={styles.image}
                      resizeMode="contain"
                      onLoad={() => setImagesLoaded(prev => prev + 1)}
                      onError={() => setImagesLoaded(prev => prev + 1)}
                    />
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: currentItem.imgCuatroUrl }}
                      style={styles.image}
                      resizeMode="contain"
                      onLoad={() => setImagesLoaded(prev => prev + 1)}
                      onError={() => setImagesLoaded(prev => prev + 1)}
                    />
                  </View>
                </View>
                {imagesLoaded < 4 && (
                  <View style={styles.imageLoadingOverlay}>
                    <ActivityIndicator size="large" color='#00BF63' />
                    <Text style={styles.imageLoadingText}>Espere un momento.</Text>
                    <Text style={styles.imageLoadingText}>Cargando imágenes...</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.inputSection}>
              <Text style={styles.questionText}>¿Qué letra es?</Text>

              <TextInput
                style={[
                  styles.textInput,
                  submitted && userAnswer.toLowerCase() === currentItem?.answer.toLowerCase() && styles.correctInput,
                  submitted && userAnswer.toLowerCase() !== currentItem?.answer.toLowerCase() && styles.incorrectInput]}
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="Escribe la letra aquí..."
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={1}
                editable={!submitted}
                selectTextOnFocus={!submitted}
              />

              {submitted && (
                <View style={[
                  styles.resultContainer,
                  userAnswer.toLowerCase() === currentItem?.answer.toLowerCase()
                    ? styles.correctResult
                    : styles.incorrectResult
                ]}>
                  <Text style={styles.resultText}>
                    {userAnswer.toLowerCase() === currentItem?.answer.toLowerCase()
                      ? '¡Correcto! ✓'
                      : `Incorrecto. La respuesta es: ${currentItem?.answer.toUpperCase()}`
                    }
                  </Text>
                </View>
              )}

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!userAnswer.trim() || submitted || imagesLoaded < 4) && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={!userAnswer.trim() || submitted || imagesLoaded < 4}
                >
                  <Text style={[styles.submitButtonText,
                  (!userAnswer.trim() || submitted) && styles.submitButtonTextDisabled
                  ]}>
                    {submitted ? 'Siguiente' : 'Enviar'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                  disabled={submitted || imagesLoaded < 4}
                >
                  <Text style={styles.skipButtonText}>Saltar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.restartButton}
              onPress={resetGame}
            >
              <Text style={styles.restartButtonText}>Reiniciar Juego</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

// ========== ESTILOS ==========
const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { zIndex: 10, flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'MontserratAlternates-Regular',
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'MontserratAlternates-Bold',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scoreContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  scoreText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'MontserratAlternates-SemiBold',
  },
  description: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'MontserratAlternates-Regular',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  imagesGrid: {
    marginBottom: 30,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageContainer: {
    width: '48%',
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: 'auto',
    resizeMode: 'cover',
  },
  inputSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
  },
  questionText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'MontserratAlternates-SemiBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    fontFamily: 'MontserratAlternates-SemiBold',
    textAlign: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'transparent',
    color: '#OOOOOO',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  correctInput: {
    borderColor: '#00BF63',
    backgroundColor: '#f0fff4',
  },
  incorrectInput: {
    borderColor: '#FF6B6B',
    backgroundColor: '#fff0f0',
  },
  resultContainer: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  correctResult: {
    backgroundColor: 'rgba(0, 191, 99, 0.2)',
    borderColor: '#00BF63',
  },
  incorrectResult: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderColor: '#FF6B6B',
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'MontserratAlternates-SemiBold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#00BF63',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontFamily: 'MontserratAlternates-Bold',
  },
  submitButtonTextDisabled: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'MontserratAlternates-Bold',
  },
  skipButton: {
    flex: 0.4,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'MontserratAlternates-SemiBold',
  },
  restartButton: {
    backgroundColor: '#00BF63',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  restartButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: 'MontserratAlternates-Bold',
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  imageLoadingText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'MontserratAlternates-Regular',
    marginTop: 10,
  },
});

export default MemoryScreen;