import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderDos from '../components/headerDos';
import httpClient from '../api/http';
import Sound from 'react-native-sound';
import { SvgUri } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');
const GRADIENT_COLORS = ['#00BF63', '#0A4C40'];
const BackgroundAbstract = require('../assets/images/bg-image.png');

Sound.setCategory('Playback');

// --- Tipos ---
type QuestionType = {
  id: number;
  question: string;
  imageUrl: string;
  options: string[];
  correctAnswer: string;
};

type QuizResponse = {
  success: boolean;
  data: QuestionType;
};

// --- Constantes de Almacenamiento ---
const USED_QUESTIONS_KEY = '@UsedQuestions';

// Contador global de solicitudes
let apiRequestCount = 0;

// --- Componente Principal ---
export default function QuizScreen({ navigation, route }: any) {
  const initialStreak = route.params?.savedStreak || 0;

  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(initialStreak);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showContinueScreen, setShowContinueScreen] = useState(false);
  const [continueTimeLeft, setContinueTimeLeft] = useState(15);

  // Refs para evitar recreación de funciones
  const usedQuestions = useRef<number[]>([]);
  const hasLoadedInitialData = useRef(false);
  const continueTimerRef = useRef<number | null>(null);
  const questionTimerRef = useRef<number | null>(null);

  // --- Funciones principales ---
  const handleSaveAndExit = useCallback(() => {
    // Limpiar todos los timers
    if (continueTimerRef.current) clearTimeout(continueTimerRef.current);
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    
    console.log('[QUIZ] Guardando y saliendo - Racha:', streak);
    navigation.navigate('Racha', {
      streak,
      savedStreak: streak,
    });
  }, [navigation, streak]);

  const handleTimeUp = useCallback(() => {
    if (answered || showContinueScreen) return;
    
    console.log('[QUIZ] Tiempo agotado');
    setAnswered(true);
    
    // Pequeño delay para mostrar feedback
    setTimeout(() => {
      handleSaveAndExit();
    }, 1500);
  }, [answered, showContinueScreen, handleSaveAndExit]);

  // --- Cargar preguntas usadas desde almacenamiento ---
  const loadUsedQuestions = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(USED_QUESTIONS_KEY);
      if (stored) {
        usedQuestions.current = JSON.parse(stored);
        console.log('[CACHE] Preguntas usadas cargadas:', usedQuestions.current.length);
      }
    } catch (error) {
      console.error('[CACHE] Error cargando preguntas usadas:', error);
    }
  }, []);

  // --- Guardar preguntas usadas ---
  const saveUsedQuestions = useCallback(async () => {
    try {
      await AsyncStorage.setItem(USED_QUESTIONS_KEY, JSON.stringify(usedQuestions.current));
    } catch (error) {
      console.error('[CACHE] Error guardando preguntas usadas:', error);
    }
  }, []);

  // --- Fetch de pregunta optimizado ---
  const fetchRandomQuestion = useCallback(async () => {
    // Evitar múltiples cargas
    if (hasLoadedInitialData.current && currentQuestion) {
      return;
    }

    try {
      setLoading(true);
      console.log('[QUIZ] Iniciando carga de pregunta...');

      // Cargar preguntas usadas si es la primera vez
      if (!hasLoadedInitialData.current) {
        await loadUsedQuestions();
      }

      apiRequestCount++;
      console.log(`[API] Realizando solicitud a la API (#${apiRequestCount})...`);

      const response = await httpClient.get<QuizResponse>('/aeronautical-alphabet/quiz/random');
      
      if (!response.data.success) {
        throw new Error('API respondió con success=false');
      }

      const questionData = response.data.data;
      console.log('[QUIZ] Pregunta recibida:', questionData.id);

      // Verificar si la pregunta ya fue usada
      if (usedQuestions.current.includes(questionData.id)) {
        console.log('[QUIZ] Pregunta repetida, solicitando otra...');
        // Recursión limitada
        if (usedQuestions.current.length < 50) {
          fetchRandomQuestion();
        } else {
          // Resetear preguntas usadas si hay demasiadas
          usedQuestions.current = [];
          setCurrentQuestion(questionData);
          usedQuestions.current.push(questionData.id);
        }
        return;
      }

      // Actualizar estado
      setCurrentQuestion(questionData);
      setSelectedOption(null);
      setAnswered(false);
      setTimeLeft(30);
      setShowContinueScreen(false);

      // Guardar pregunta como usada
      usedQuestions.current.push(questionData.id);
      saveUsedQuestions();

      hasLoadedInitialData.current = true;

    } catch (error) {
      console.error('[QUIZ] Error al obtener pregunta:', error);
      Alert.alert('Error', 'No se pudo cargar la pregunta');
    } finally {
      setLoading(false);
    }
  }, [currentQuestion, loadUsedQuestions, saveUsedQuestions]);

  // --- useEffects ---
  // Bloquear botón "Atrás"
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showContinueScreen) {
        return false; // Permitir retroceso en pantalla de continuación
      }
      
      Alert.alert('Quiz en Progreso', '¿Estás seguro de que quieres salir? Se perderá tu progreso actual.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', onPress: () => handleSaveAndExit() }
      ]);
      return true;
    });
    
    return () => backHandler.remove();
  }, [showContinueScreen, handleSaveAndExit]);

  // Cargar primera pregunta
  useEffect(() => {
    if (!hasLoadedInitialData.current) {
      fetchRandomQuestion();
    }

    return () => {
      // Cleanup al desmontar
      if (continueTimerRef.current) clearTimeout(continueTimerRef.current);
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    };
  }, [fetchRandomQuestion]);

  // Temporizador de pregunta
  useEffect(() => {
    if (!currentQuestion || answered || showContinueScreen) return;
    
    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }

    questionTimerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000) as unknown as number;
    
    return () => {
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    };
  }, [timeLeft, answered, currentQuestion, showContinueScreen, handleTimeUp]);

  // Temporizador de pantalla de continuación
  useEffect(() => {
    if (!showContinueScreen) return;
    
    if (continueTimeLeft === 0) {
      handleSaveAndExit();
      return;
    }
    
    continueTimerRef.current = setTimeout(() => setContinueTimeLeft(t => t - 1), 1000) as unknown as number;
    
    return () => {
      if (continueTimerRef.current) clearTimeout(continueTimerRef.current);
    };
  }, [showContinueScreen, continueTimeLeft, handleSaveAndExit]);

  // --- Acciones ---
  const handleOptionSelect = (option: string) => {
    if (answered || showContinueScreen || !currentQuestion) return;

    setSelectedOption(option);
    setAnswered(true);

    if (option === currentQuestion.correctAnswer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      setTimeout(() => {
        setShowContinueScreen(true);
        setContinueTimeLeft(15);
      }, 1000);
    } else {
      setTimeout(() => {
        handleSaveAndExit();
      }, 1000);
    }
  };

  const handleContinuePlaying = () => {
    // Limpiar timer de continuación
    if (continueTimerRef.current) {
      clearTimeout(continueTimerRef.current);
    }
    
    setShowContinueScreen(false);
    setContinueTimeLeft(15);
    fetchRandomQuestion();
  };

  // --- Estilos dinámicos ---
  const getOptionStyle = (option: string) => {
    if (!answered) return selectedOption === option ? styles.optionSelected : styles.option;
    if (option === currentQuestion?.correctAnswer) return styles.optionCorrect;
    if (option === selectedOption) return styles.optionWrong;
    return styles.option;
  };

  const getOptionTextStyle = (option: string) => {
    if (!answered) return selectedOption === option ? styles.optionTextSelected : styles.optionText;
    if (option === currentQuestion?.correctAnswer || option === selectedOption)
      return styles.optionTextSelected;
    return styles.optionText;
  };

  // --- Pantalla de continuación ---
  if (showContinueScreen) {
    return (
      <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fullScreen}>
        <Image source={BackgroundAbstract} resizeMode="cover" style={styles.backgroundImage} />
        <SafeAreaView style={styles.safeArea}>
          <HeaderDos />
          <View style={styles.continueContainer}>
            <Text style={styles.continueTitle}>¡Correcto! 🎉</Text>
            <Text style={styles.continueStreak}>Racha actual: {streak}</Text>
            <View style={styles.timerCircle}>
              <Text style={styles.timerCircleText}>{continueTimeLeft}s</Text>
            </View>
            <Text style={styles.continueMessage}>¿Quieres continuar con la siguiente pregunta?</Text>
            <View style={styles.continueButtons}>
              <TouchableOpacity
                style={[styles.continueButton, styles.continueButtonYes]}
                onPress={handleContinuePlaying}
              >
                <Text style={styles.continueButtonText}>Sí, Continuar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.continueButton, styles.continueButtonNo]}
                onPress={handleSaveAndExit}
              >
                <Text style={styles.continueButtonText}>Guardar y Salir</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.continueNote}>
              Se guardará automáticamente en {continueTimeLeft} segundos
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // --- Pantalla principal ---
  return (
    <LinearGradient colors={GRADIENT_COLORS} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fullScreen}>
      <Image source={BackgroundAbstract} resizeMode="cover" style={styles.backgroundImage} />
      <SafeAreaView style={styles.safeArea}>
        <HeaderDos />
        {currentQuestion && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{timeLeft}s</Text>
            <View style={[styles.timerBar, { width: `${(timeLeft / 30) * 100}%` }]} />
          </View>
        )}
        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>Racha: {streak}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Cargando pregunta...</Text>
          </View>
        ) : currentQuestion ? (
          <View style={styles.quizContainer}>
            <View style={styles.questionCard}>
              <View style={styles.imageContainer}>
                <SvgUri
                  uri={currentQuestion.imageUrl}
                  width="80%"
                  height="80%"
                  onError={e => console.log('Error cargando imagen:', e)}
                />
              </View>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={getOptionStyle(option)}
                    onPress={() => handleOptionSelect(option)}
                    disabled={answered}
                  >
                    <Text style={getOptionTextStyle(option)}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {answered && (
                <View style={styles.feedbackContainer}>
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <Text style={styles.feedbackCorrect}>¡Correcto! 🎉</Text>
                  ) : (
                    <Text style={styles.feedbackWrong}>
                      Correcto: {currentQuestion.correctAnswer}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudo cargar la pregunta</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchRandomQuestion}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- Estilos (mantener igual) ---
const styles = StyleSheet.create({
  fullScreen: { flex: 1 },
  safeArea: { zIndex: 10, flex: 1 },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  timerContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'MontserratAlternates-Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  timerBar: {
    height: 6,
    backgroundColor: '#00BF63',
    borderRadius: 3,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  streakText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'MontserratAlternates-Bold',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    width: screenWidth * 0.9,
    maxWidth: 400,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0A4C40',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#00BF63',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 15,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: '#0A4C40',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 28,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  option: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#00BF63',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#0A4C40',
  },
  optionCorrect: {
    backgroundColor: '#00BF63',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#0A4C40',
  },
  optionWrong: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#CC0000',
  },
  optionText: {
    color: '#333',
    fontFamily: 'MontserratAlternates-SemiBold',
    fontSize: 10,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: 'white',
    fontFamily: 'MontserratAlternates-SemiBold',
    fontSize: 12,
    textAlign: 'center',
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(10, 76, 64, 0.1)',
  },
  feedbackCorrect: {
    color: '#00BF63',
    fontFamily: 'MontserratAlternates-Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  feedbackWrong: {
    color: '#FF6B6B',
    fontFamily: 'MontserratAlternates-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  continueContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  continueTitle: {
    fontSize: 32,
    fontFamily: 'MontserratAlternates-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  continueStreak: {
    fontSize: 24,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  timerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#00BF63',
  },
  timerCircleText: {
    fontSize: 24,
    fontFamily: 'MontserratAlternates-Bold',
    color: 'white',
  },
  continueMessage: {
    fontSize: 20,
    fontFamily: 'MontserratAlternates-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  continueButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  continueButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
    alignItems: 'center',
  },
  continueButtonYes: {
    backgroundColor: '#00BF63',
  },
  continueButtonNo: {
    backgroundColor: '#FF6B6B',
  },
  continueButtonText: {
    color: 'white',
    fontFamily: 'MontserratAlternates-SemiBold',
    fontSize: 16,
  },
  continueNote: {
    color: 'white',
    fontFamily: 'MontserratAlternates-Regular',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
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